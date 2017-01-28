/**
 *speciesManager.js
 *@author: Edward FitzSimons
 *js class that manages species data
 */

// ~~~~~~~~~~~~~~~Species Data~~~~~~~~~~~~~~

//Initial data
var name = '-default';
var imageURL = '-default-';
var info = '-default-';
var removal = '-default-';

//Create initial JSON for species data
var initSpeciesJSON = {
    name: name,
    imageURL: imageURL,
    info: info,
    removal: removal};

/**
 * Node export that manages species data handling
 */
module.exports = function(){
    console.log("Species manager functions initialized");

    var speciesManager = function(){};

    speciesManager.addSpecies = function(species){

	
    }
    //todo: Auto populate species from mongo
};
