var fs = require('fs');
var path = require('path');
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/config.json')[env];
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};
var pg = require('pg');


//var conString = process.env.ELEPHANTSQL_URL || "postgres://postgres:5432@localhost/postgres";

var conString = "postgres://rtzglhtgrsgbqy:77c6c3167d3740e8dd82d86fae9dc538bbad9c02d2fb5756a8a9107bed38fa99@ec2-54-83-25-217.compute-1.amazonaws.com:5432/dbn2mc11m452j0";


var client = new pg.Client(conString);
client.connect();

sequelize
    .authenticate()
    .then(function(err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });



db.lead = sequelize.import(__dirname + '/API/models/lead.js');
db.student = sequelize.import(__dirname + '/API/models/student.js');
db.teacher = sequelize.import(__dirname + '/API/models/teacher.js');
db.batch = sequelize.import(__dirname + '/API/models/batch.js');
db.studentfeedback = sequelize.import(__dirname + '/API/models/studentfeedback.js');
db.testdetail = sequelize.import(__dirname + '/API/models/testdetail.js');




// defining associations within models
db.student.belongsTo(db.batch);
db.batch.hasMany(db.student);
db.teacher.hasMany(db.batch);
db.batch.belongsTo(db.teacher);
db.studentfeedback.belongsTo(db.student);
db.student.hasMany(db.studentfeedback);
db.testdetail.belongsTo(db.teacher);
db.teacher.hasMany(db.testdetail);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


client.end();

