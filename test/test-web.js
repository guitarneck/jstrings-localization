"use strict";

var http    = require('http'),
    url     = require('url'),
    path    = require('path'),
    fs      = require('fs'),
    opener  = require('opener');

var exts = {
    '.html'     : 'text/html',
    '.js'       : 'text/javascript',
    '.css'      : 'text/css;X-Content-Type-Options: nosniff;',
    '.txt'      : 'text/plain'
};

const root  = path.resolve(__dirname,'..');
const host  = 'localhost';
const port  = 8080;

var server = http.createServer(function(req ,res){

    var file = url.parse(req.url).pathname;
            
    if ( file === '/' | file === '/test/' )
    {
        res.writeHead(302, {'Location': 'test/index.html'});
        res.end('<meta http-equiv="refresh" content="0; url=http://'+server.address().address+':'+port+'/test/index.html" />');
    }
    else
    {
        var file_path   = path.join(root,file);
    
        if ( fs.existsSync(file_path) )
        {
            var ext = path.extname( file_path );
            //console.log ( 'file exists ' + file_path );
            fs.readFile( file_path, 'utf8', function(error,data){
                if (error)
                {
                    res.statusCode = 404;
                    res.statusMessage = http.STATUS_CODES[404];
                }
                else
                {
                    res.writeHead(200, {
                        'Connection'        : 'keep-alive',
                        'Content-Length'    : Buffer.byteLength(data),
                        'Content-Type'      : exts[ext]
                    });
                    res.write(data);
                }
                res.end();
            });
        }
        else
        {
            res.statusCode = 404;
            res.statusMessage = http.STATUS_CODES[404];
            res.end();
        }
    }

}).listen(port,host,function(){
    opener('http://'+server.address().address+':'+port+'/');
});