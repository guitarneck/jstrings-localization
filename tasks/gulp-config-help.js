"use strict";

var gutil   = require('gulp-util');

module.exports = function(gulp,config){

    gulp.task('help',function(){

        var t,td  = [['help','Display this tasks list.',[]]],max=0;

        function store ( tag )
        {
            max = Math.max(max,tag.task.length);
            td.push([tag.task,tag.desc,gulp.tasks[tag.task].dep]);
        }

        for ( var all in config )
        {
            store( config[all] );                
            config[all].subs && config[all].subs.map(function(st){ store( config[all][st] ) });
        }
    
        td.sort(function(a, b){return (a[0]>b[0]?-1:(a[0]<b[0]?1:0))}); // reverse order, then pop()
        
        function fill ( l ){var s='';while(l--){s+=' '};return s}
        var pad = fill( max + 3 );
        
        while ( t = td.pop() )
        {
            gutil.log(  gutil.colors.black.bold(t[0]),
                        fill(max - t[0].length)+': ',
                        gutil.colors.gray(t[1])
            );
            t[2].length && gutil.log(pad,gutil.colors.white('['+t[2].toString()+']'));
        }

    });

};