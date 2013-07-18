var express = require('express'),
    cors = require('cors'),
    webcommand = require('webcommand'),
    parseUrl = require('webcommand').parseUrl,
    generateUrl = require('webcommand').generateUrl,
    stream = require('event-stream');
var request = require('request');

module.exports = createServer;

function createServer(cmdList){
    var webCommand = webcommand(cmdList);
    var app = express();
    app.use(cors());
    app.get('/getCommands', cors(), function(req,res) {
        res.send(JSON.stringify(webCommand.getCommandList()));
    });

    app.post('/*', function(req,res){
        var wc = parseUrl(req.url),
            cStream= stream.through();
        cStream.on('error', function(err) {
            console.error(err);
        });
        if(wc.pipes){
            var curPipe = wc.pipes.shift(),
                purl = generateUrl({
                cmd : curPipe.cmd,
                args : curPipe.args,
                pipes : wc.pipes
            });
            var iStream= stream.through();
            iStream.pipe(request.post(purl)).pipe(res);
            webCommand.webCommand(wc.cmd,wc.args, req, iStream, cStream);
        }
        else{
            webCommand.webCommand(wc.cmd,wc.args, req, res, cStream);
        }
    });
    return app;
}
