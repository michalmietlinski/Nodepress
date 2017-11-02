var http = require("http");
var https = require("https");
url = "";

// get is a simple wrapper for request()
// which sets the http method to GET
var options = {
    host: 'https://api.um.warszawa.pl',
    port: 443,
    path: '/api/action/dbtimetable_get?id=e923fa0e-d96c-43f9-ae6e-60518c9f3238&busstopId=5003&busstopNr=01&line=190&apikey=d874836c-a865-4dc4-8f21-d7f27d77678f',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

module.exports =function(){
    return new Promise(function(resolve, reject) {
            console.log("rest::getJSON");

            var prot = options.port == 443 ? https : http;
            var req = prot.request(options, function(err, res) {
                var output = '';
                console.log(options.host + ':' + res.statusCode);
                res.setEncoding('utf8');

                res.on('data', function(chunk) {
                    output += chunk;
                });

                res.on('end', function() {
                    var obj = JSON.parse(output);
                    resolve(res.statusCode, obj);
                });
            });

            req.on('error', function(err) {
                reject(err)
                    //res.send('error: ' + err.message);
            });

            req.end();
        });
   
    }