// Express provides a framework that makes handling HTTP
// request/repsonse sequences simpler
var express = require('express');

// Body Parser - body parser is a convenient piece of "middleware"
// that parses the incoming body of the HTTP request before your route
// handler gets access. The nice thing about this is that we are
// sending JSON data and specifying this in the Content-Type portion
// of the HTTP header and because of this, body parser interprets the
// JSON data and places it into named structures in the req.body
// component. Thus, if you have a element named "name" in your JSON,
// you can access its value with req.body.name.
var bodyParser = require('body-parser');

// ===============================================
//              MONGO DATA
// ==============================================

// MongoDB will be used to store server data
//var mongodb = require('./mongoDBFunctions.js')();


//EXPORT APP
module.exports = function(){

    // ================================================
    // ================================================
    //                SET UP APP
    // ================================================
    // ================================================

    // The main instanced class, called app will be initialized by express
    var app = express()
    // Set the port in the app system
    // The next two sections tell bodyParser which content types to
    // parse. We are mainly interested in JSON, ut eventually, encoded,
    // multipart data may be useful.

    // Set the port in the app system
    app.set("port", 4196);

    app.use(bodyParser.urlencoded({   // support encoded bodies
	extended: true
    }));
    app.use(bodyParser.json());  // support json encoded bodies

    // ----------------------------------------
    // GET
    // ----------------------------------------

    //returns all species
    app.get('/speciesData', function(req, res) {

	console.log('/speciesData GET URI accessed');
    });

    // ----------------------------------------
    // POST
    // ----------------------------------------

    //Attempts to add a new species
    app.post('/speciesData', function(req, res) {

	// If for some reason, the JSON isn't parsed, return a HTTP ERROR
	// 400
	if (!req.body) return res.sendStatus(400);

	console.log('/speciesData POST URI on SPECIES DATA SERVER accessed');
    });

    // ----------------------------------------
    // PUT
    // ----------------------------------------

    app.put('/speciesData', function(req, res) {

	// If for some reason, the JSON isn't parsed, return a HTTP ERROR
	// 400
	if (!req.body) return res.sendStatus(400);

	console.log('/speciesData PUT URI on SPECIES DATA SERVER accessed');
    });

    // ----------------------------------------
    // DELETE
    // ----------------------------------------

    //attempts to remove a species
    app.delete('/userData', function(req, res) {

	console.log('/speciesData DELETE URI on SPECIES DATA SERVER accessed');
    });

    // ERROR Conditions
    // ----------------
    // page not found - 404
    app.use(function(req, res, next) {
	res.status(404).send('Sorry cant find that!');
    });

    // page not found - 404
    app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Internal Server Error message - very strange request came in and we do not know how to handle it!!!');
    });

    // ================================================
    // ================================================
    // ================================================
    // 
    // FINALLY, start the app and let it listen for connections on the
    // network
    //
    // This really needs to be last.
    //
    // app.listen opens up a network socket on port "port" and waits for
    // HTTP connections
    //
    // ================================================
    // ================================================
    // ================================================
    app.listen(app.get("port"), function () {
	console.log('Invasive Species Data Server: Node app listening on port: ', app.get("port"));
    });

    return app;
}
