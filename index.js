/**
 *index.js
 *This file is called with node and starts the servers
 *required for the invasive species finder to function
 */

//RUN SERVERS

/**
 *Server that stores tile and point data, as well as
 *speces information
 */
require('./speciesTrackingServer.js')();
