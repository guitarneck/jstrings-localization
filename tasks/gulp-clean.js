"use strict";

var del         = require('del');

module.exports = function(gulp,config){

    gulp.task(config.task ,function(){
        return del(config.files)
    });

};