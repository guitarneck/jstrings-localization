"use strict";

var concat      = require('gulp-concat'),
    order       = require('gulp-order');

module.exports = function(gulp,config){

    gulp.task(config.concat.task ,function(){
        var mapped;
        for ( var pkg in config.concat.grp )
        {
            mapped = [];
            mapped = config.concat.grp[pkg].map(function(f){return config.bas+f});

            gulp.src(mapped ,{newLine:'\n'})
                .pipe(order())
                .pipe(concat(pkg))
                .pipe(gulp.dest(config.dst));
        } 
    });

    gulp.task(config.copy.task ,function(){
        var mapped = [config.src];
        for ( var pkg in config.concat.grp )
        {
            mapped = mapped.concat( config.concat.grp[pkg].map(function(f){return '!'+config.bas+f}) );
        }

        return gulp.src(mapped ,{base:config.bas})
                   .pipe(gulp.dest(config.dst));
    });

    gulp.task(config.task ,[config.concat.task ,config.copy.task]);

};