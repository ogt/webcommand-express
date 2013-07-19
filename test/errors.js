var test = require("tap").test,
    request = require('request'),
    getport = require('getport'),
    webcommand = require('../');

function localhostUrl(port,cmd) { return 'http://localhost:'+port+'/'+cmd; }
getport(10000,20000, function(e,port) {

    test('getCommands',function(t) {
        var server = webcommand(['cat']).listen(port);
        request(localhostUrl(port,'getCommands'), function(err, res, body) {
            if (err) { throw err; } 
            t.equal(res.statusCode, 200, 'getCommands 200');
            t.deepEqual(['cat'],JSON.parse(body), 'getCommands returns list'); 
            t.end();
            server.close();
        });
    });
});
