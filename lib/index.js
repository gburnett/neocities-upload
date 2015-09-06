#! /usr/bin/env node
/*jslint node: true */
/*jslint nomen: true */
'use strict';

var argv = require('minimist')(process.argv.slice(2)),
    NeoCities = require('neocities'),
    prompt = require('prompt'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    schema = {
        properties: {
            username: {
                message: 'Username please',
                required: true
            },
            password: {
                message: 'Password please',
                required: true,
                hidden: true
            }
        }
    },
    noisy = function noisy(options) {
        return (!options.q && !options.quiet);
    },
    handleResponse = function handleResponse(resp) {
        if (noisy(argv)) {
            console.log(resp);
        }
    },
    update = function update(credentials) {
        var api = new NeoCities(credentials.username, credentials.password),
            readDirectory = function readDirectory(err, files) {
                var postMap = function postMap(err, mapped) {
                    if (err) {
                        throw err;
                    }

                    api.upload(mapped, handleResponse);
                },
                    prepareUpload = function prepareUpload(file, callback) {
                        var filePath = path.join('.', file);
                        return callback(null, { name: file, path: filePath });
                    },
                    postFilter = function postFilter(filtered) {
                        async.map(filtered, prepareUpload, postMap);
                    },
                    fileFilter = function fileFilter(file, callback) {
                        var filePath = path.join('./', file),
                            isFile = function isFile(err, stats) {
                                if (err) {
                                    throw err;
                                }
                                callback(stats.isFile());
                            };

                        if (file.indexOf('.') === 0) {
                            callback(false);
                        } else {
                            fs.stat(filePath, isFile);
                        }
                    };

                if (err) {
                    throw err;
                }

                async.filter(files, fileFilter, postFilter);
            };

        fs.readdir('.', readDirectory);
    };

try {
    prompt.start();

    prompt.get(schema, function (err, result) {
        if (err) {
            throw err;
        }
        update(result);
    });
} catch (e) {
    console.log(e);
}
