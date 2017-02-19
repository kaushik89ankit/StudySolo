'use strict';
module.exports = function(sequelize, DataTypes) {
    var student_feedback = sequelize.define('studentfeedback', {
        student_loginID: {

            type: DataTypes.STRING,
            allowNull: false,
        },
        student_feedback_subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        student_feedback_message: {
            type: DataTypes.STRING,
            allowNull: false,
        }

    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return student_feedback;
};
