/**
 * Tile Manager/Creation functions for node server
 */

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

/**
 * Node export that manages tile creation and manipulation, as
 * well as updates and storage
 */
module.exports = function(){

    var tileManager;
    
    /**
     * Function to initialize grid areas
     */
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
}
