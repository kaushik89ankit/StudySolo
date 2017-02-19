'use strict';
module.exports = function(sequelize, DataTypes) {
    var batch = sequelize.define('batch', {
        batchname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }

    });
    return batch;
};
