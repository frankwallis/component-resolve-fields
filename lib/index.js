/*
 * component-resolve-fields
 * https://github.com/frankwallis/component-resolve-fields
 *
 * Copyright (c) 2014 Frank Wallis
 * Licensed under the MIT license.
 */

var path = require('path');
var builder = require("component-builder");
var resolver = require("component-resolver");

function scripts(options, onfile, done) {
    return resolveList(builder.scripts, options, onfile, done);
}

function files(options, onfile, done) {
    return resolveList(builder.files, options, onfile, done);
}

function styles(options, onfile, done) {
    return resolveList(builder.styles, options, onfile, done);
}

function custom(options, onfile, done) {

    if ((!options) || (typeof(options) == 'function'))
        throw new Error("plesae provide some options");

    if (!options.fields)
        throw new Error("plesae provide some fields");
    
    return resolveList(builder.files, options, onfile, done);
}

function isLocal(branch, options) {

    var result = (branch.type == 'local');

    if (!result && options.linkedLocals) {
        var stats = fs.lstatSync(branch.path);
        result = stats && stats.isSymbolicLink();
    }

    return result;
}

function resolveList(buildFn, options, onfile, done) {

    if (typeof(options) == 'function') {
        done = options
        options = {};
    }

    options = options || {};
    options.fields = options.fields || options.remoteFields || options.localFields;

    function createHandler(fieldname) {

        return function(file, cb) {

            if (options.filterRx && !options.filterRx.test(file.filename))
                return cb();
               
            if (isLocal(file.branch, options)) {

                if (options.localFilterRx && !options.localFilterRx.test(file.filename))
                    return cb();

                if (options.localFields && (options.localFields.indexOf(fieldname) < 0)) 
                    return cb();
            }
            else {

                if (options.remoteFilterRx && !options.remoteFilterRx.test(file.filename))
                    return cb();

                if (options.remoteFields && (options.remoteFields.indexOf(fieldname) < 0)) 
                    return cb();
            }

            onfile(file, cb);
        }
    }

    var resolveFn;

    if (options.tree)
        resolveFn = function(a, b, cb) { cb(null, options.tree); } 
    else
        resolveFn = resolver;

    // resolve the dependency tree
    resolveFn(null, options, function (err, tree) {
        if (err) return done(err);
            
        var instance = buildFn(tree, options);

        options.fields.forEach(function(fieldname) {
            instance.use(fieldname, createHandler(fieldname));
        });
       
        instance.end(function (err, string) {
            if (err) return done(err);
            done(err);
        });
    });    
}

module.exports.files = files;
module.exports.styles = styles;
module.exports.scripts = scripts;
module.exports.custom = custom;