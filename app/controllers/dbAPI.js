/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    uid = require('uid'),
    fs = require('fs'),
    async = require('async'),
    _ = require('lodash'),
    nodemailer = require('nodemailer');



/**
 * Insert Data
 */
exports.insert = function(req, res) {

    // if model is not default as input
    // lets say tata! Lol
    if (!req.body.model) {
        res.json([]);
        return;
    }

    // add User Id
    req.body.userId = req.user._id;

    // create model obj
    var tModel = req.body.model;
    var CommonModel = mongoose.model(req.body.model);

    // clear the model value
    // we are sure its extra field
    req.body.model = '';

    // @todo Filter stuff
    // @todo Permission logic
    // @todo remove extra fields

    // Save data in main collection

    // Genrate tags Id

    if (!req.body.isChildInsert) {

        var insertP = function() {

            // Common Action to save data
            var commonFormData = new CommonModel(req.body);

            commonFormData.save(function(err, result) {

                if (err) {
                    res.json({
                        status: false
                    });
                    return;
                }

                // --

                res.json({
                    status: true,
                    result: result
                });

            });
        };

        // --

        if (req.body.tags) {
            getDynamicTagsByName(req.body.tags, function(tags) {
                req.body.tags = tags;
                insertP();
            });
        } else {
            insertP();
        }
    }

    if (req.body.isChildInsert) {

        // define temp vars so we could empty value of
        // body.* extra action vars
        var entityId = req.body.entityId,
            entityKey = req.body.entityKey,
            pushData = {};

        // assign default _id mongoObj
        req.body._id = mongoose.Types.ObjectId();

        // clear data which passed for action purpose
        delete req.body.entityId;
        delete req.body.entityKey;

        pushData = req.body;
        pushData._id = mongoose.Types.ObjectId();

        // --
        // Insert new child

        CommonModel.findOne({
            _id: entityId
        }, function(err, data) {
            if (data) {

                data[entityKey].push(req.body);

                data.save(function(err, data) {

                    if (err) {
                        res.json({
                            status: false,
                            err: err
                        });
                    }
                    // --

                    res.json({
                        status: true,
                        result: pushData
                    });
                });
            } else {
                res.json({
                    status: false,
                    err: err
                });
            }
        });
    }
};



/**
 *
 */
exports.update = function(req, res) {

    if (!req.body.model || !req.body._id) {
        res.json([]);
        return;
    }

    var commonModel = mongoose.model(req.body.model);

    // Update common Data
    var _id = req.body._id;

    delete req.body._id;
    delete req.body.model;

    var updateP = function() {

        commonModel.update({
            '_id': _id
        }, req.body, {
            multi: true
        }, function(err, result) {
            if (err) {

                res.json({
                    err: err,
                    status: false
                });
                return;
            }
            res.json({
                status: true,
                result: req.body
            });
            return;
        });
    };

    // --

    if (req.body.tags) {
        getDynamicTagsByName(req.body.tags, function(tags) {
            req.body.tags = tags;
            updateP();
        });
    } else {
        updateP();
    }
};



/**
 * Delete
 */
exports.delete = function(req, res) {

    if (!req.body.model || !req.body._id) {
        res.json([]);
        return;
    }

    var commonModel = mongoose.model(req.body.model);

    commonModel.findOne({
        _id: req.body._id
    }).remove(function(err, result) {
        if (err) {
            res.json({
                status: false
            });
            return;
        }

        res.json({
            status: true,
            responseIds: req.body._id
        });
        return;
    });
};


/**
 * Get Condition Specific Common All Data
 */
exports.findAll = function(req, res) {

    if (!req.body.model) {
        res.json([]);
        return;
    }

    var commonModel = mongoose.model(req.body.model);
    var inputCondition = {};

    inputCondition.userId = req.user._id;
    for (var conRow in req.body.condition) {
        inputCondition[conRow] = req.body.condition[conRow];
    }

    // --

    commonModel.find(inputCondition).exec(function(err, responseData) {
        res.json(responseData);
        return;
    });
};



/**
 * Get Common Single Data
 */
exports.findOne = function(req, res) {

    if (!req.body.model || !req.body._id) {
        res.json([]);
        return;
    }

    // --

    var commonModel = mongoose.model(req.body.model);
    var conditionD = {
        userId: req.user._id,
        _id: req.body._id
    };

    // --

    commonModel.findOne(conditionD).exec(function(err, responseData) {
        res.json(responseData);
        return;
    });
};



/**
 * update child Record
 */
exports.updateChild = function(req, res) {

    if (!req.body.model || !req.body.entityId) {
        return res.json([]);
    }

    var commonModel = mongoose.model(req.body.model);

    var entityId = req.body.entityId,
        childEntityId = req.body.childEntityId,
        entityKey = req.body.entityKey;

    delete req.body.entityId;
    delete req.body.childEntityId;
    delete req.body.entityKey;


    var updateData = {};
    for (var row in req.body) {
        updateData[row] = req.body[row];
    }

    var pull = {};
    pull[entityKey] = {
        _id: mongoose.Types.ObjectId(childEntityId)
    };

    var push = {};
    updateData._id = mongoose.Types.ObjectId(childEntityId);
    push[entityKey] = updateData;

    commonModel.update({
        '_id': entityId
    }, {
        $pull: pull
    }).exec(function(err, result) {

        if (err) {
            res.json({
                status: false,
                err: err
            });
            return;
        }

        // --

        commonModel.update({
            '_id': entityId
        }, {
            $push: push
        }).exec(function(err, result) {

            if (err) {
                res.json({
                    status: false,
                    err: err
                });
                return;
            }

            res.json({
                status: true,
                result: updateData
            });
            return;
        });
    });
};



// Use Smtp Protocol to send Email
function sendMail(mailOptions) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ajudiyatejas@gmail.com',
            pass: 't9712210715'
        }
    });

    transporter.sendMail(mailOptions, function(err, response) {
        if (err) return err;
        return response;
    });
};



// Generate Unique ID
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}



// Generate Unique ID
function uuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return 'U' + s4() + s4() + s4() + s4() + 'E';
}



/**
 * Get Tags Id by Name of array
 * @param  {Array}
 */
var getDynamicTagsByName = function(names, cb) {

    var TagsModel = mongoose.model('Tags');

    if (!(names && names.length)) {
        cb([]);
        return;
    }

    var returns = [];
    var loopInc = 0;
    var loops = function() {

        if (names.length <= loopInc) {
            cb(returns);
            return;
        }

        // --

        if (names[loopInc].text) {
            names[loopInc].text = names[loopInc].text.toLowerCase();
        };


        TagsModel.find({
            name: names[loopInc].text
        }).exec(function(err, tags) {

            if (tags && tags.length) {
                returns[returns.length] = tags[0]._id;
                loopInc += 1;
                loops();
            } else {
                var tagsFormData = new TagsModel({
                    name: names[loopInc].text
                });
                tagsFormData.save(function(err, tag) {
                    returns[returns.length] = tag._id;
                    loopInc += 1;
                    loops();
                });
            }
        });
    };

    loops();
};

// --
// Get Tags Data

exports.getTagData = function(req, res) {
    var TagsModel = mongoose.model('Tags');

    var regex = new RegExp(req.query.query, 'i');

    TagsModel.find({
        name: regex
    }).exec(function(err, result) {

        if (err) {
            res.json({
                status: false
            });
            return;
        }

        res.json({
            status: true,
            result: result
        });
        return;
    });
};



/**
 * Common file upload method
 */
exports.commonUploadFile = function(req, res) {

    var filePath = {
        1: __dirname + '/../../public/uploads/workers/',
        2: __dirname + '/../../public/uploads/clients',
        3: __dirname + '/../../public/uploads/banks',
        4: __dirname + '/../../public/uploads/bills',
    };


    var fileObject = req.files.file,
        destinationpath = filePath[req.params.key];

    // --

    var extArray = fileObject.originalFilename.split('.');
    var ext = extArray[extArray.length - 1];
    var fileName = uid(10) + '.' + ext;

    fs.readFile(fileObject.path, function(err, data) {

        if (err) {
            res.send(err);
            return;
        }

        var newPath = destinationpath + fileName;

        fs.writeFile(newPath, data, function(err) {

            if (err) {
                res.send(err);
                return;
            }

            res.send({
                original: req.files.file.name,
                image: fileName,
                status: true
            });


            if (req.params.key == 5) {

                var s3 = require('s3');

                var client = s3.createClient({
                    maxAsyncS3: 20, // this is the default
                    s3RetryCount: 3, // this is the default
                    s3RetryDelay: 1000, // this is the default
                    multipartUploadThreshold: 20971520, // this is the default (20 MB)
                    multipartUploadSize: 15728640, // this is the default (15 MB)
                    s3Options: {
                        accessKeyId: "AKIAJUWBN65RJBIWTGOA",
                        secretAccessKey: "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",
                        region: "us-east-1"
                    },
                });

                var params = {
                    localFile: __dirname + '/../../public/modules/octorev/assets/uploads/media-lib/' + fileName,
                    s3Params: {
                        Bucket: 'dp-creatives/octorev-dev/media-lib',
                        Key: fileName,
                        ACL: 'public-read'
                    },
                };

                var uploader = client.uploadFile(params);

                uploader.on('error', function(err) {
                    console.error("unable to upload:", err.stack);
                });

                uploader.on('progress', function() {
                    console.log("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
                });

                uploader.on('end', function() {
                    console.log("done uploading");
                });
            }

            return;
        });
    });
};



/**
 * Upload base64 File
 * Create real file in drive
 */
function decodeBase64Image(dataString) {

    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (!matches || matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
};
