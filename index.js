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
// The next two sections tell bodyParser which content types to
// parse. We are mainly interested in JSON, ut eventually, encoded,
// multipart data may be useful.

// Set the port in the app system
app.set("port", 4321);

app.use(bodyParser.urlencoded({   // support encoded bodies
    extended: true
}));
app.use(bodyParser.json());  // support json encoded bodies

// ===============================================
//              MONGO DATA
// ==============================================

// MongoDB will be used to store server data
var mongodb = require('./mongoDBFunctions.js')();

// Tile data
var tileManager = require('./tileManager.js')();
var tileArray = tileManager.initGrids();

// ================================================
// ================================================
//                STORED DATA
// ================================================
// ================================================

// ~~~~~~~~USER DATA~~~~~~~~~~~~~~~~~~
// ~Currently Not Implemented, Saved For Later~

/*
var name = "~DEFAULT~";
var email = "~DEFAULT~";
var password = "~DEFAULT~";

var initUserJSON = {
    name: name,
    email: email,
    password: password};

var userArray = {
    users: []};
userArray.users.push(initUserJSON);
*/

// ----------------------------------------
// GET
// ----------------------------------------

//userData
app.get('/userData', function(req, res) {

    console.log('/userData GET URI accessed');
});

//gridData
//returns the grid
app.get('/mapData', function(req, res) {

    console.log('/mapData GET URI accessed');
    console.log('Tiles returned:', tileArray.tiles.length);
    res.send(JSON.stringify(tileArray));
});

// ----------------------------------------
// POST
// ----------------------------------------

//userData
//Attempts to insert new user
app.post('/userData', function(req, res) {

     // If for some reason, the JSON isn't parsed, return a HTTP ERROR
    // 400
    if (!req.body) return res.sendStatus(400);

    var newUser = {
	name: req.body.name,
	email: req.body.email,
	password: req.body.password
    };

    mongodb.insertUser(newUser);

    console.log('/userData POST URI accessed');
    res.send(JSON.stringify(exists));
});

//gridData
//Updates tiles. Updates individual tiles rather than
//The entire grid
app.post('/mapData', function(req, res) {

    // If for some reason, the JSON isn't parsed, return a HTTP ERROR
    // 400
    if (!req.body) return res.sendStatus(400);

    var tile = req.body;
    updateTile(tile);
    
    console.log('/mapData POST URI accessed');
});

// ----------------------------------------
// PUT
// ----------------------------------------

//userData
//Attempts to find user based on input
app.put('/userData', function(req, res) {

    // If for some reason, the JSON isn't parsed, return a HTTP ERROR
    // 400
    if (!req.body) return res.sendStatus(400);

    var email = req.body.email;
    var user = mongodb.getUser(email, function(result){});

    console.log('/userData PUT URI accessed');
    res.send(JSON.stringify(user));
});

//gridData
app.put('/mapData', function(req, res) {

    console.log('/mapData PUT URI accessed');
});

// ----------------------------------------
// DELETE
// ----------------------------------------

//userData
app.delete('/userData', function(req, res) {

    console.log('/userData DELETE URI accessed');
});

//gridData
app.delete('/mapData', function(req, res) {

    console.log('/mapData DELETE URI accessed');
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

    //mongodb.clearTiles(); //Uncomment when we need to remove collection
    //Check if tile collection exists on database
    //If not, add it
    
    mongodb.collection("tiles").count(function(err, count){
	
	//If the collection is empty
	if (!err && count == 0) {
	    console.log("No tile array exists");
	    	    
	    //Insert tile data to database
	    mongodb.pushTiles(tileArray);
	}

	//Collection exists, but not updated to all tiles
	else if(!err && count < tileArray.tiles.length){
	    console.log(count, " tiles found. Updating missing tiles.");
	    tileArray = mongodb.updateTileData(tileArray);
	    mongodb.pushTiles(tileArray)}

	//Overflow: More tiles in database than there should be
	else if(!err && count > tileArray.tiles.length){
	    console.log("Overflow of tiles in database: "
			+ count);}
	
	//collection exists on server
	else if(!err){
	    console.log("tileArray found on database");
	    console.log(count);}

	//An error occurred
	else{
	    console.log("Error while counting tiles on database");}
    });
});
