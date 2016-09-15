#! /usr/bin/env node
/*jslint node: true */
/*jslint nomen: true */
'use strict';

var argv = require('minimist')(process.argv.slice(2)),
    NeoCities = require('neocities'),
    prompt = require('prompt'),
    recursive = require('recursive-readdir'),
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
    mapFiles = function mapFiles(file) {
        var filePath = process.cwd(),
            name = file.replace(filePath + '/', ''),
            path = file.replace(filePath, '.');

        return {
            name: name,
            path: path
        };
    },
    update = function update(credentials) {
        var api = new NeoCities(credentials.username, credentials.password);

        recursive(process.cwd(), ['\.*'], function (err, files) {
            var mappedFiles;
            if (err) {
                throw err;
            }
            mappedFiles = files.map(mapFiles);
            api.upload(mappedFiles, handleResponse);
        });
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
