var express = require('express');
var app = express();
var path = require('path');
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);
var cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());



// serving up static files in Public folder
app.use(express.static(__dirname + '/public'));


//displaying landing page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


//storing leads generated from landing page
app.post('/', function(req, res) {
    var body = _.pick(req.body, 'name', 'email', 'address', 'mobileno');
    db.lead.create(body).then(function(lead) {
        res.json(lead.toJSON());
    }, function(e) {
        res.status(400).json(e);
    });
});


//displaying signin page for students
app.get('/signin', function(req, res) {
    res.status(200).sendFile(path.join(__dirname + '/public/app/index.html'));
});




//signing in by student
app.post('/signin', function(req, res) {
    var body = _.pick(req.body, 'loginID', 'password');
    var token;
    var callresponse = {};
    // To find the student instance
    db.student.authenticate(body).then(function(student) {
        //generating token for a student to be wrapped in cookie
        token = student.generateToken('authentication');
        callresponse.student = _.pick(student, 'id', 'student_loginID', 'student_email', 'student_school', 'batchId');
        // To find the batch instance
        db.batch.findById(student.batchId).then(function(batch) {
            callresponse.batch = _.pick(batch, 'id', 'batchname', 'teacherId');
            //To find teacher instance
            db.teacher.findById(batch.teacherId).then(function(teacher) {
                callresponse.teacher = _.pick(teacher, 'id', 'teacher_email', 'teacher_name', 'teacher_mobile', 'teacher_address');
                res.header('StudentAuth', token).cookie('token', token, {
                    expires: new Date(Date.now() + 9999999),
                    httpOnly: false
                }).json(callresponse);
            }, function(e) {
                console.error(e);
                return res.status(401).send();
            })
        }, function(e) {
            console.error(e);
            return res.status(401).send();
        })
    }, function(e) {
        console.error(e);
        return res.status(401).send();
    });
});


//Requesting Home Page by student
app.get('/student', middleware.requireStudentAuthentication, function(req, res) {

    res.sendFile(path.join(__dirname + '/public/app/dashboard/student/index.html'));
});


//Requesting List of upcoming tests by student
app.get('/studentget/upcomingtests', middleware.requireStudentAuthentication, function(req, res) {
    db.batch.findById(req.student.batchId).then(function(batch) {
        db.teacher.findById(batch.teacherId).then(function(teacher) {
            db.testdetail.findAll({
                where: {
                    teacherId: teacher.id,
                    test_status: 'Scheduled',
                    test_for_batches: { $contains: [batch.batchname] }
                }
            }).then(function(testdetails) {
                res.json(testdetails);
            }, function(e) {
                console.error(e);
                return res.status(401).send();
            });
        }, function(e) {
            console.error(e);
        });
    }, function(e) {
        console.error(e);
    });
});









// Requesting Test Questions while taking test
app.get('/studenttake/test/:test_ID',middleware.requireStudentAuthentication, function(req, res){

    
    db.testdetail.findOne({ where :
        {test_ID : req.params.test_ID
        }
    }).then(function(testdetail){
        res.json(testdetail);
    },function(e){
        console.error(e);
    });

});


















// Posting student feedback
app.post('/studentfeedback/submit', middleware.requireStudentAuthentication, function(req, res) {
    var body = _.pick(req.body, 'student_loginID', 'student_feedback_subject', 'student_feedback_message');
    // Adding feedback created by student
    db.studentfeedback.create(body).then(function(studentfeedback) {
        req.student.addStudentfeedback(studentfeedback).then(function() {
            return studentfeedback.reload();
        }).then(function() {
            // The successful response call. 
            //Add here any JSON object if you want to send to client-side.            
            res.status(200).send();
        });
    }, function(e) {
        console.error(e);
        return res.status(401).send();
    });
});


//Adding Teacher
app.post('/rootuser', function(req, res) {
    var body = _.pick(req.body, 'teacher_loginID', 'teacher_password', 'teacher_email', 'teacher_mobile', 'teacher_name', 'teacher_address');
    db.teacher.create(body).then(function(teacher) {
        res.json(teacher);
    }, function(e) {
        return res.status(401).send();
    });
});




// display sign in for teachers 
app.get('/teachersignin', function(req, res) {
    res.send("This is where teachers will sign in after authenticate git ");
});




//signing in by teacher
app.post('/teachersignin', function(req, res) {
    var body = _.pick(req.body, 'loginID', 'password');
    db.teacher.authenticate(body).then(function(teacher) {
        res.header('Auth', teacher.generateToken('authentication')).json(teacher.toJSON());
    }, function() {
        return res.status(401).send();
    });
});


//GET Homepage for Teacher









//Creating a new batch
app.post('/teacher/Mybatches', middleware.requireTeacherAuthentication, function(req, res) {
    var body = _.pick(req.body, 'batchname');
    db.batch.create(body).then(function(batch) {
        req.teacher.addBatch(batch).then(function() {
            return batch.reload();
        }).then(function(batch) {
            var batchname = encodeURIComponent(body.batchname);
            res.redirect('/teacher/Mybatches/' + batchname).json(batch.toJSON());
        });
    }, function(e) {
        console.error(e);
        return res.status(401).send();
    });
});


//Getting students in a batch by teacher
app.get('/teacher/Mybatches/:batchname', middleware.requireTeacherAuthentication, function(req, res) {
    res.send("Add students to the new Batch formed called :" + req.params.batchname);
});



//Adding a student in a batch
app.post('/teacher/Mybatches/:batchname', middleware.requireTeacherAuthentication, function(req, res) {
    var batchname = req.params.batchname;
    var body = _.pick(req.body, 'student_loginID', 'student_password', 'student_email', 'student_school');
    //assigning the batch to the request
    db.batch.findOne({
        where: {
            batchname: batchname
        }
    }).then(function(batch) {
        //checking the authenticity of the teacher editing the batches
        if (batch.teacherId != req.teacher.id) {
            console.log("You are not allowed to change details of this section");
            return;
        }
        // Adding the found batch to the request object
        req.batch = batch;
        //creating the student in a batch
        db.student.create(body).then(function(student) {
            req.batch.addStudent(student).then(function() {
                return student.reload();
            }).then(function(student) {
                res.json(student.toJSON());
            });
        }, function(e) {
            console.error(e);
            return res.status(401).send();
        });
    }, function(e) {
        console.error(e);
    });
});













// Creating new Test by teacher
app.post('/teacher/createtest', middleware.requireTeacherAuthentication, function(req, res) {
    var body = _.pick(req.body, 'test_ID', 'test_title', 'test_duration_seconds', 'test_description', 'test_window_duration_start', 'test_window_duration_end', 'test_status', 'test_for_batches', 'test_topics','test_questions');
    db.testdetail.create(body).then(function(testdetail) {
        req.teacher.addTestdetail(testdetail).then(function() {
            return testdetail.reload();
        }).then(function(testDetail) {
            res.status(200).send();
        });
    }, function(e) {
        console.log("Not able to connect to server.js file");
        console.error(e);
    });
});



//initializing database models and starting server
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express server started on ' + PORT);
    });
});









// Add models for questions

// Student can take tests and submit them
