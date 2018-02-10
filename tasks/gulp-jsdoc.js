"use strict";

var jsdoc   = require('gulp-jsdoc3'),
    del     = require('del');

module.exports = function(gulp,config){

    var jsdocconf = require('../jsdoc.json');

    gulp.task(config.task ,function(cb){
        del([jsdocconf.opts.destination+'/*','!'+jsdocconf.opts.destination]);

        gulp.src(config.src, {read: false})
            .pipe(jsdoc(jsdocconf,cb));
    });

};