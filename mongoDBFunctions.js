//
// This file, mongoDBFunctions.js is treated like a Node.js module.
//
// 

var mongojs = require("mongojs");           //mongo wrapper
var url = 'mongodb://localhost:27017/my_database_name'; //URL: this is for test purposes
var collections = ['documents']; //Array of known collections

var assert = require('assert');

// 
// This is an example of Node.js anonymous function. It is being used
// so that we can have a single connection to the MongoDB from your
// node.js server code and so that you can build up a set of functions
// to operate on the db in more useful ways, like you might if you had
// objects or other functions.
//
module.exports = function() {
    mongodb = mongojs(url, collections); //creation of the mongo connection
    console.log("Connected to Mongo DB - all functions are now active.");

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

    // Upon the call to require('mongoDBFunctions.js'), the functions
    // above will be exported for use in your code, and then this call
    // will return the mongodb reference back to the return of the
    // require, thus giving you access to the 'db'
    // 
    return mongodb;
}
