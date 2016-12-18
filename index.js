/**
 *index.js
 *This file is called with node and starts the servers
 *required for the invasive species finder to function
 */

//RUN SERVERS

/**
 *Server that stores and retrieves data regarding what
 *species of plants we wish to track
 */
require('./speciesDataServer.js')();

/**
 *Server that stores tile and point data
 */
require('./speciesTrackingServer.js')();
