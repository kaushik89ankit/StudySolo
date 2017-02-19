module.exports = function(db) {
    return {
        requireStudentAuthentication: function(req, res, next) {

            var token = req.cookies.token;
            //var token = req.get('StudentAuth');
            db.student.findByToken(token).then(function(student) {
                req.student = student;
                next();
            }, function() {
                res.status(401).send();
            });
        },
        requireTeacherAuthentication: function(req, res, next) {
            var token = req.get('Auth');
            db.teacher.findByToken(token).then(function(teacher) {
                req.teacher = teacher;
                next();
            }, function() {
                res.status(401).send();
            });
        }
    };
};