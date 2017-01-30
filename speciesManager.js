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
//Eventually replace this with pure mongo
//Array is for testing ONLY
var initSpeciesJSON = {
    name: name,
    imageURL: imageURL,
    info: info,
    removal: removal};

var speciesArray = {
    species: []};

/**
 * Function to check the validity of a species.
 * Data is invalid if any entry is equal to the default value
*/
function isValid(species){
    var valid = true;

    //Add shit later
    return valid;
}

/**
 * Checks for existence of species with given name
 * @return true if species exists
*/
function exists(name){
    var exists = false;

    for(var i = 0; i < speciesArray.length && !exists; i++){
	if(speciesArray[i].name == name){
	    exists = true;
	}
    }

    return exists;
}

/**
 * Node export that manages species data handling
 */
module.exports = function(){
    console.log("Species manager functions initialized");

    var speciesManager = function(){};

    /**
     * Function to add a species to the array/mongo
     * If there exists a species with the name of the passed
     * Data, the new data will not be added.
     * @return true if data was added, false otherwise
     */
    speciesManager.addSpecies = function(species){

	var added = false;
	
	if(isValid(species)){
	    if(!exists(species.name)){
		speciesArray.species.push(species);
		added = true;
	    }
	}

	return added;
    }

    /**
     * Function to update a species of plant with new data
     * Only updates when the name of the new species matches
     * an existing entry.
     * @return true if updated
     */
    speciesManager.updateSpecies = function(species){
    }

    /**
     * Function to remove a species from the daya
     * @return true if removed
     */
    speciesManager.removeSpecies = function(species){
    }

    /**
     * Gets species by name
     * @return matching species
     * @return default if there is no match
     */
    speciesManager.getSpecies = function(name){
    }

    /**
     * Checks for existence of species with given name
     * @return true if species exists
     */
    speciesManager.exists = function(name){

	return exists(name);
    }

    return speciesManager;
};
