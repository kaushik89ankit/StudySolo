var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');


'use strict';
module.exports = function(sequelize, DataTypes) {
    var teacher = sequelize.define('teacher', {
        teacher_loginID: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            }
        },
        teacher_email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        teacher_name: {
            type: DataTypes.STRING,
            validate: {
                len: [1, 250]
            }
        },
        teacher_mobile: {
            type: DataTypes.STRING,
            validate: {
                len: [1, 250]
            }
        },
        teacher_address: {
            type: DataTypes.STRING,
            validate: {
                len: [1, 250]
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        teacher_password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 100]
            },
            set: function(value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);
                this.setDataValue('teacher_password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        }
    }, {
        hooks: {
            beforeValidate: function(teacher, options) {
                //validating Email of student
                if (typeof teacher.teacher_loginID === 'string') {
                    teacher.teacher_loginID = teacher.teacher_loginID.toUpperCase();
                }
            }
        },
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            },
            authenticate: function(body) {
                return new Promise(function(resolve, reject) {
                    if (typeof body.loginID !== 'string' || typeof body.password !== 'string') {
                        return reject();
                    }
                    body.loginID = body.loginID.toUpperCase();
                    teacher.findOne({
                        where: {
                            teacher_loginID: body.loginID
                        }
                    }).then(function(teacher) {
                        if (!teacher || !(bcrypt.compareSync(body.password, teacher.get('password_hash')))) {
                            return reject();
                        }
                        resolve(teacher);
                    }, function(e) {
                        console.error(e);
                        return reject();
                    });
                })
            },
            findByToken: function(token) {
                return new Promise(function(resolve, reject) {
                    try {
                        var decodedJWT = jwt.verify(token, 'qwerty');
                        var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!@#');
                        var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

                        teacher.findById(tokenData.id).then(function(teacher) {
                            if (teacher) {
                                resolve(teacher);
                            } else {
                                reject();
                            }
                        }, function(e) {
                            reject();
                        })
                    } catch (e) {
                        reject();
                    }
                });
            }
        },
        instanceMethods: {
            generateToken: function(type) {
                if (!_.isString(type)) {
                    return undefined;
                }
                try {
                    var stringData = JSON.stringify({
                        id: this.get('id'),
                        type: type
                    });
                    var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#').toString();
                    var token = jwt.sign({
                        token: encryptedData
                    }, 'qwerty');
                    return token;
                } catch (e) {
                    return undefined;
                }
            }
        }
    });
    return teacher;
};
