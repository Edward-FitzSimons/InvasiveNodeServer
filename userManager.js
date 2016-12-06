/**
 * A manager for the user data
 */

// ~~~~~~~~USER DATA~~~~~~~~~~~~~~~~~~
// ~Currently Not Implemented, Saved For Later~

module.exports = function(){

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
    
    var userManager = function(){}

    /**
     *Adds a user to the array
     */
    userManager.addUser = function(user){

	var exists = true;

	if(userManager.findUser(user.email) == null){
	    userArray.users.push(user);
	    exists = false;
	    console.log("Pushed user " + user.name);
	}
	
	return exists;
    }

     /**
     * Finds and returns a user based on email
     * @return Tile JSON
     */
    userManager.findUser = function(email){

	var rtrnUser = null;
	var userList = userArray.users;
	var found = false;

	for(var i = 0; i < userList.length && !found; ++i){
	    if(email == userList[i].email){
		rtrnUser = userList[i];
		found = true;
	    }
	}

	return rtrnUser;
    }

    console.log("Usermanager created. Functions initialized");
    return userManager;
}
