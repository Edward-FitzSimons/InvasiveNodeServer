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

// The main instanced class, called app will be initialized by express
var app = express()

// Set the port in the app system
app.set("port", 4321);

// The next two sections tell bodyParser which content types to
// parse. We are mainly interested in JSON, ut eventually, encoded,
// multipart data may be useful.
app.use(bodyParser.urlencoded({   // support encoded bodies
    extended: true
}));
app.use(bodyParser.json());  // support json encoded bodies

// ================================================
// ================================================
//                STORED DATA
// ================================================
// ================================================

//************* To be Implemented

// ----------------------------------------
// GET
// ----------------------------------------

//userData
app.get('/userData', function(req, res) {

    console.log('/userData GET URI accessed');
});

//gridData
app.get('/gridData', function(req, res) {

    console.log('/gridData GET URI accessed');
});

// ----------------------------------------
// POST
// ----------------------------------------

//userData
app.post('/userData', function(req, res) {

    console.log('/userData GET URI accessed');
});

//gridData
app.post('/gridData', function(req, res) {

    console.log('/gridData POST URI accessed');
});

// ----------------------------------------
// PUT
// ----------------------------------------

//userData
app.put('/userData', function(req, res) {

    console.log('/userData PUT URI accessed');
});

//gridData
app.put('/gridData', function(req, res) {

    console.log('/gridData PUT URI accessed');
});

// ----------------------------------------
// DELETE
// ----------------------------------------

//userData
app.delete('/userData', function(req, res) {

    console.log('/userData DELETE URI accessed');
});

//gridData
app.delete('/gridData', function(req, res) {

    console.log('/gridData DELETE URI accessed');
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
    console.log('Invasive Species Tracker Server: Node app listening on port: ', app.get("port"));
});
