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

// MongoDB will be used to store server data
var mongodb = require('mongodb');

// Set up mongo client
var MongoClient = mongodb.MongoClient;

// Set up mongo client url (currently localhost)
var url = 'mongodb://localhost:27017/invasive_server_data';

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

// ~~~~~~~~USER DATA~~~~~~~~~~~~~~~~~~

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

// ~~~~~~~~~~~~~~MAP DATA~~~~~~~~~~~~~~~~~

//Tile data
var lat = -1.0;
var lang = -1.0;
var status = -1; //status will indicate check time

//Create initial JSON for tile object
var initTileJSON = {
    lat: lat,
    lang: lang,
    status: status,
    species: []};

var tileArray = {
    tiles: []};
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

///////////////////////////////////////////
//         Database Tile Array
var dbTileArray = null;

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

    var exists = {
	exists: insertUser(newUser)};

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
    var user = findUser(email);

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
// 
// BEFORE the app's server is started, a mongodb server
// is started.
//
// ================================================
// ================================================
MongoClient.connect(url, function (err, db) {
    if (err) {
	console.log('Unable to connect to the mongoDB server. Error:', err);
	initGrids();
    }
    else {
	//HURRAY!! We are connected. :)
	console.log('Connection established to', url);

	//Allow database use outside of this method
	dataBase = db;
	initGrids();
	
	//Check if tile collection exists on database
	//If not, add it
	dbTileArray = db.collection('tiles');
	//dbTileArray.drop(); //Uncomment when we need to remove collection

	dbTileArray.count(function(err, count){
	    //If the collection is empty
	    if (!err && count == 0) {
		console.log("No tile array exists");
		
		//Insert tile data to database
		pushTileArrayToDB();
	    }

	    //Collection exists, but not updated to all tiles
	    else if(!err && count < tileArray.tiles.length){
		console.log(count, " tiles found. Updating missing tiles.");
		updateDBTiles();}

	    //Overflow: More tiles in database than there should be
	    else if(!err && count > tileArray.tiles.length){
		console.log("Overflow of tiles in database");}
	    
	    //collection exists on server
	    else if(!err){
		console.log("tileArray found on database");
		console.log(count);}

	    //An error occurred
	    else{
		console.log("Error while counting tiles on database");}
	});
	//dbTileArray.drop(); //Uncomment when we need to remove collectio
  }
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

//================================================
//                Utility Functions

// Function finds a user on email
function findUser(email){

    var userList = userArray.users;
    var rtrnUser = userList[0];
    var found = false;

    for(var i = 1; i < userList.length && !found; ++i){
	if(email == userList[i].email){
	    rtrnUser = userList[i];
	    found = true;
	}
    }

    return rtrnUser;
}

// Function either updates or inserts a new user to the server data
// Returns boolean based on whether or not user already exists
function insertUser(user){

    var userList = userArray.users;
    var found = false;

    for(var i = 0; i < userList.length && !found; ++i){
	if(user.name == userList[i].name){
	    userArray.users[i] = user;
	    found = true;
	}
    }
    if(!found){
	userArray.users.push(user);
    }

    return found;
}

// Function finds a tile based on lat and lang
function findTile(lat, lang){

    var rtrnTile = null;
    var tileList = tileArray.tiles;
    var found = false;

    for(var i = 0; i < tileList.length && !found; ++i){
	if(lat == tileList[i].lat
	  && lang == tileList[i].lang){
	    rtrnTile = tileList[i];
	    found = true;
	}
    }
}

// Function updates a tile
function updateTile(tile){

    var tileList = tileArray.tiles;
    var found = false;
    
    for(var i = 0; i < tileList.length && !found; ++i){
	if(tile.lat == tileList[i].lat
	  && tile.lang == tileList[i].lang){
	    tileArray.tiles[i] = tile;
	    found = true;
	}
    }
}

//Function that checks tiles for existance on the server
//Based on their existence locally
//If the tiles on the server is not on the database, the tile
//Is added to the server
function updateDBTiles(){

    tileList = tileArray.tiles;
    for(var i = 0; i < tileList.length - 1; i++){

	var ilat = tileList[i].lat;
	var ilang = tileList[i].lang;

	dbTileArray.find({lat: ilat, lang: ilang}).toArray(function(err, result){
	    if(err || !result.length){
	    }
	    else{
		tileArray.tiles[i].lat = result.lat;
		tileArray.tiles[i].lang = result.lang;
		tileArray.tiles[i].status = result.status;
		tileArray.tiles[i].species = result.species;
	    }
	});
    }

    pushTileArrayToDB();
}

//Deletes the collection on the server and completely re-pushes
//the tileArray
function pushTileArrayToDB(){

    dbTileArray.drop();
    dbTileArray.insert(tileArray.tiles, function(err, result){
	if (err) {
	    console.log(err);
	} else {
	    printTilesFromDB(); //Comment out when not testing
	}
    });    
}

/////////////////////////////////////////////////////////
//      Functions to initialize grids
function initGrids(){

    tileArray.tiles.push(initTileJSON);
    addGrid(46.805993, -92.100449, 21, 13); //Chester Park
    addGrid(46.820421, -92.091951, 11, 11); //Bagley Park
    
    addGrid(46.819225, -92.068734, 5, 5); //Congdon Park 1
    addGrid(46.819225, -92.063734, 5, 1); //Congdon Park 2
    addGrid(46.818725, -92.062734, 3, 3); //Congdon Park 3
    addGrid(46.818225, -92.059734, 3, 3); //Congdon Park 4
    addGrid(46.816225, -92.056734, 5, 3); //Congdon Park 5
}

/**
* Function adds a grid to the tile array
* @param strtLat Latitude of upper left grid corner
* @param strtLang Longitude of upper left grid corner
* @param width of grid
* @param height of grid
*/
function addGrid(strtLat, strtLang, width, height){
    for(var i = 0; i < .0005 * width; i += .0005){
	for(var j = 0; j < .001 * height; j += .001){

	    var	tile = {
		lat: strtLat + i,
		lang: strtLang + j,
		status: -1,
		species: []};
	    tileArray.tiles.push(tile);
	}}
}

////////////////////////////////////////////////////
//       Database functions

var getTileByLatLang = function(ilat, ilang, callback){
    dbTileArray.find({lat: ilat, lang: ilang}).toArray(cb);
}
