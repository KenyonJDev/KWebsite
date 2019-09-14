
'use strict'

const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	async register(username, password, filename, filetype) {
		const fileExtension = mime.extension(filetype)
		await fs.copy(path, `public/avatars/${username}.${fileExtension}`)
		password = await bcrypt.hash(password, saltRounds)
		const sql = `INSERT INTO users(user, pass) VALUES("${username}", "${password}")`
		await this.db.run(sql)
		return true
	}

	async login(username, password) {
		let sql = `SELECT count(id) AS count FROM users WHERE user="${body.user}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`username "${username}" not found`)
		sql = `SELECT pass FROM users WHERE user = "${body.user}";`
		const record = await db.get(sql)
		const valid = await bcrypt.compare(body.pass, record.pass)
		if(valid == false) throw new Error(`invalid password for account "${username}"`)
		return true
	}

	async checkCredentials(username, password) {
		let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
		const records = await this.db.all(sql)
		if(!records.count) throw new Error("invalid username")
		sql = `SELECT pass FROM users WHERE user = "${username}";`
		const record = await this.db.get(sql)
		const valid = await bcrypt.compare(password, record.pass)
		if(valid == false) throw new Error(`invalid password`)
		return true
	}

/**
 * This function checks the database to see if a username already exists in
 * the database. If it detects a duplicate it throws an exception.
 * @param {String} username - The username to check.
 * @returns {boolean} - returns true if the username does not exist.
 * @throws {Error} - throws an error if the username already exists.
 */
	async checkNoDuplicateUsername(username) {
		return true
	}

/**
 * This function takes data from an uploaded image and saves it to the `avatars` directory. The file name will be the username.
 * @param {String} path - the location of the uploaded image
 * @param {String} mimeType - the mime type of the uploaded file.
 * @returns {boolean} - returns true if the image is valid and is saved.
 * @throws {TypeError} - throws an error if the file is not a png or jpg image.
 */
	async saveImage(path, mimetype) {
		return true
	}

/**
 * This function adds new users to the database.
 * @param {String} username - The username to to add.
 * @param {String} password - The password to add.
 * @returns {boolean} - returns true if the username does not exist.
 * @throws {Error} - throws an error if the new user account has been created.
 */
	async addUser(username, password) {
		return true
	}
	
}