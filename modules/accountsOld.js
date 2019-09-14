#!/usr/bin/env node

/**
 * Accounts module
 * @module modules/accounts
 */

'use strict'

var sqlite = require('sqlite-async');
let bcrypt = require('bcrypt-promise');

/**
 * This is a generic function that opens the database, executes a query,
 * closes the database connection and returns the data.  
 * @param {String} query - The SQL statement to execute.
 * @returns {Object} - the date returned by the query.
 */
async function runSQL(query) {
    try {
		console.log(query)
		let DBName = "./website.db";
		const db = await sqlite.open(DBName);	
		const data = await db.all(query);  
		await db.close();
		if(data.length === 1) return data[0]
		return data;
	} catch(err) {
		throw err
	}
}

module.exports.checkCredentials = async(username, password)=> {
	try {
	    var records = await runSQL(`SELECT count(id) AS count FROM users WHERE user="${username}";`);
		if(!records.count) throw new Error("invalid username")
		const record = await runSQL(`SELECT pass FROM users WHERE user = "${username}";`)
		const valid = await bcrypt.compare(password, record.pass)
		if(valid == false) throw new Error(`invalid password`)
		return true
	} catch(err) {
	throw err
	}
}



/* ----------------------------- STUB FUNCTIONS ----------------------------- */

/**
 * This function checks the database to see if a username already exists in
 * the database. If it detects a duplicate it throws an exception.
 * @param {String} username - The username to check.
 * @returns {boolean} - returns true if the username does not exist.
 * @throws {Error} - throws an error if the username already exists.
 */
async function checkNoDuplicateUsername (username) {
	return true
}

/**
 * This function takes data from an uploaded image and saves it to the `avatars` directory. The file name will be the username.
 * @param {String} path - the location of the uploaded image
 * @param {String} mimeType - the mime type of the uploaded file.
 * @returns {boolean} - returns true if the image is valid and is saved.
 * @throws {TypeError} - throws an error if the file is not a png or jpg image.
 */
async function saveImage(path, mimetype) {
	return true
}

/**
 * This function adds new users to the database.
 * @param {String} username - The username to to add.
 * @param {String} password - The password to add.
 * @returns {boolean} - returns true if the username does not exist.
 * @throws {Error} - throws an error if the new user account has been created.
 */
module.exports.addUser = async(username, password) => {
    return true;  
}