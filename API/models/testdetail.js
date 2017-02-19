'use strict';
module.exports = function(sequelize, DataTypes) {
    var testdetail = sequelize.define('testdetail', {

        test_ID: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            },
            notify:true
        },
        test_title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            },
            notify:true
        },
        test_duration_seconds: {
            type: DataTypes.INTEGER,
            allowNull: false,
            notify:true
        },
        test_description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            },
            notify:true
        },
        test_window_duration_start: {
            type: DataTypes.DATE,
            allowNull: true,
            notify:true
        },
        test_window_duration_end: {
            type: DataTypes.DATE,
            allowNull: true,
            notify:true
        },
        test_status: { // Should be Draft , Submitted
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Draft",
            notify:true
        },
        test_for_batches: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            notify:true
        },
        test_topics: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            notify:true
        },
        test_questions:{
            type:DataTypes.ARRAY(DataTypes.JSON),
            allowNull:true,
            notify:true
        },
        test_answer_key:{
            type:DataTypes.ARRAY(DataTypes.BOOLEAN),
            notify:true
        }

    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return testdetail;
};


