"use strict";

var pk      = require('../package.json'),
    gutil   = require('gulp-util');

module.exports = function(gulp,config){

    gulp.task(config.task ,function(){
        gutil.log('Version : ',gutil.colors.green.bold(pk.version))
    });

};