# Invasive Species Tracker Node Server

## Authors
   * Edward FitzSimons
   * Matt Alacheff
   * Landon Nelson
   * Ryan Novotny

## Purpose

   This server is meant to act as storage for user and grid data for the Invasive Species Tracker android app. For the time being, the invasive species are being written in-app, with the intention of initializing them on the server in the future.

   This server is also functioning as a temporary login server.

## Branch

   Intended for the use of running a new server that runs on a different port. This server is used to gather species data so it may be assigned dynamically.

   *DO NOT MERGE THIS UNTIL IT HANDLES IMAGE DATA*

## Current Mongo Functionality

   As of right now, there is no mongo functionality with the server. This is due to issues regarding node.js and mongo that we've been experiencing on some systems. So at the moment the data is all kept on the server. We intend to fix this with future builds.

### Related Repositories:

Invasive Specise App: https://github.com/ryannovotny/Invasive-Species