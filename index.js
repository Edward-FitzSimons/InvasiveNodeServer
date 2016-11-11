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
var lat = -1;
var lang = -1;
var status = -1; //status will indicate check time

//json array of species names
var speciesArray = {
    species: []}

//Create initial JSON for tile object
var initTileJSON = {
    lat: lat,
    lang: lang,
    status: status};
initTileJSON.push(speciesArray);

var tileArray = {
    tiles: []};
tileArray.tiles.push(initCircleJSON);
initGrids();
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
    console.log('Tiles returned:\n');
    console.log(JSON.stringify(tileArray));
    res.send(JSON.stringify(tileArray));
});

// ----------------------------------------
// POST
// ----------------------------------------

//userData
app.post('/userData', function(req, res) {

    console.log('/userData GET URI accessed');
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
app.put('/userData', function(req, res) {

    console.log('/userData PUT URI accessed');
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

//================================================
//                Utility Functs

// Function finds a user on email
function findUser(mail){

    var rtrnUser = null;
    var userList = userArray.users;
    var found = false;

    for(var i = 0; i < userList.length && !found; ++i){
	if(mail == userList[i].mail){
	    rtrnUser = userList[i];
	    found = true;
	}
    }

    return rtrnUser;
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

// Function either updates or inserts a new user to the server data
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

//Function creates empty grids when they don't already exist
//Mongo implementation to be added
function initGrids(){

    var lat = 46.805993;
    var lang = -92.100449;
    for(var i = 0; i < .0105; ++i){
	for(var j = 0; j < .013; ++j){
	    lat += i;
	    lang += j;

	    //Create tile
	    var tile = {
		lat: lat,
		lang: lang,
		status: -1};
	    tileArray.tiles.push(tile);
	}
    }
}

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
