
'use strict';
module.exports = function(sequelize, DataTypes) {
    var lead = sequelize.define('lead', {
        name: {

            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 250]
            }
        },
        mobileno: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [10]
            }
        }

    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return lead;
};
