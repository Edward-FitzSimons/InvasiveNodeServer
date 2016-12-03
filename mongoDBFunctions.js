//
// This file, mongoDBFunctions.js is treated like a Node.js module.
//
// 

var mongojs = require("mongojs");           //mongo wrapper
var url = 'mongodb://localhost:27017/invasive_server_data'; //URL: this is for test purposes
var collections = ['documents']; //Array of known collections

var assert = require('assert');

//Database names
var tileCollection = "tiles";
var userCollection = "users";

// 
// This is an example of Node.js anonymous function. It is being used
// so that we can have a single connection to the MongoDB from your
// node.js server code and so that you can build up a set of functions
// to operate on the db in more useful ways, like you might if you had
// objects or other functions.
//
module.exports = function() {
    mongodb = mongojs(url, collections); //creation of the mongo connection
    console.log("Connected to Mongo DB");

    /** ********************************************************************
     * printDatabase - Prints the whole collection, for debugging purposes.
     * @param collectionName - the name of the collection
     * @param callback - need to provide a function to return the data
     */
    mongodb.printDatabase = function(collectionName, callback) {

	// 
	// Collection look ups with find return a MongoDB 'cursor'. More info can be found here
	// https://docs.mongodb.com/v3.2/reference/glossary/#term-cursor
	// 
        var cursor = mongodb.collection(collectionName).find(function(err, docs) {
	    
            if(err || !docs) {
		console.log("Cannot print database or database is empty\n");
	    }
            else {
		console.log(collectionName, docs);
		callback(docs);
	    }
        });
    };

    /** Getter method for a user from the database
     * @param email parameter
     * @param boolean found or null user
     */
    mongodb.getUser = function(email, callback){
	
	var nullUser = {
	    name: "~DEFAULT~",
	    email: "~DEFAULT~",
	    password: "~DEFAULT~"
	};

	mongodb.collection(userCollection).find({"email": email}).toArray(function(err, result){
	    if(err || !result.length ){  //result is empty
		console.log("User not found");
		callback(nullUser);
	    }
	    else{
		console.log("User " + user.name + " found.");
		callback(result);
	    }
	});
    }

    /** Method to insert a user
     * @param user to add
     * @param boolean result, true if updated
     */
    mongodb.insertUser = function(user){

	mongodb.collection(userCollection).insert(user,function(err, result){
	    if(err || !result){  //result is empty
		console.log("User not inserted");
	    }
	    else{
		console.log("User " + user.name + " inserted");
	    }
	});
    }

    /**
     * function that updates tiles when the server starts
     */
    mongodb.updateTileData = function(tileArray){
	
	tileList = tileArray.tiles;
	for(var i = 0; i < tileList.length - 1; i++){

	    var ilat = tileList[i].lat;
	    var ilang = tileList[i].lang;

	    mongodb.collection(tileCollection).find(
		{lat: ilat, lang: ilang}).toArray(function(err, result){
		if(err || !result.length){
		    //Will add error
		}
		else{
		    tileArray.tiles[i].lat = result.lat;
		    tileArray.tiles[i].lang = result.lang;
		    tileArray.tiles[i].status = result.status;
		    tileArray.tiles[i].species = result.species;
		}
	    });
	}

	return tileArray;
    }

    /**
     *  pushTilesToDB - Updates the tiles on the database by pushing the server tiles to the
     *  database
     *  @param: tileArray - Entire server side tile array
     */
    mongodb.pushTiles = function(tileArray){
	
	mongodb.collection(tileCollection).drop();
	mongodb.collection(tileCollection).insert(tileArray.tiles, function(err, res){
	    if(err){
		console.log(err);
	    }
	    else{
		console.log('Tiles successfully pushed to database');
	    }
	});
    }

    /**
     * Getter method for number of tiles held in the array
     */
    mongodb.getNumberOfTiles = function(callback){

	mongo.collection(tileCollection).count(function(err, count){
	    console.log(count + " tiles on server");
	    callback(count);
	});
    }

    /**
     * Function to delete all tiles from the database
     */
    mongodb.clearTiles = function(){

	mongodb.collection(tileCollection).drop();
    }

    // Upon the call to require('mongoDBFunctions.js'), the functions
    // above will be exported for use in your code, and then this call
    // will return the mongodb reference back to the return of the
    // require, thus giving you access to the 'db'
    //
    console.log("All mongodb functions are now active");
    return mongodb;
}
