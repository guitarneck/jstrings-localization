"use strict";

var gulp    = require('gulp'),
    gutil   = require('gulp-util');

//======================================================================
// G U L P F I L E   C O N F I G
//======================================================================

var config = {

    'default':
        {
            task    : 'default',
            desc    : 'The default task.',
             
            tasks   : ['help']
        },

    'jsdoc':
        {
            task    : 'jsdoc',
            desc    : 'Generate the documentation.',

            src     : ['README.md','./lib/**/*.js'],

        },

    'version':
        {
            task    : 'version',
            desc    : 'Display this package version.',
        }

};

//======================================================================
// J S D O C
//======================================================================

try {
    require('./tasks/gulp-jsdoc.js')(gulp,config.jsdoc);

    require('./tasks/gulp-config-help.js')(gulp,config);

    require('./tasks/gulp-package-version.js')(gulp,config.version);

    gulp.task(config.default.task ,config.default.tasks);

} catch (err) { gutil.log(err) }