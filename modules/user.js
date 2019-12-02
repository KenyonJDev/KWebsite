
'use strict'

const bcrypt = require('bcrypt-promise')
const sqlite = require('sqlite-async')
const saltRounds = 10

/**
 * Class representing a song.
 * Interacts with the database.
 */
module.exports = class User {
	/**
	 * User class constructor.
	 * Leave parameter empty to create db in memory.
	 * @constructor
	 * @param {string} [dbName=:memory:] - The database filename.
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT);'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * Registers a user.
	 * @param {string} user - The username
	 * @param {string} pass - The password
	 * @returns {Promise<true>} A confirmation of registration.
	 */
	async register(user, pass) {
		try {
			if(user.length === 0) throw new Error('missing username')
			if(pass.length === 0) throw new Error('missing password')
			let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) throw new Error(`username "${user}" already in use`)
			pass = await bcrypt.hash(pass, saltRounds)
			sql = `INSERT INTO users(user, pass) VALUES("${user}", "${pass}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	/**
	 * Logs in a user if username and password are correct.
	 * @param {string} username - The username
	 * @param {string} password - The password
	 * @returns {Promise<number>} The user's ID
	 */
	async login(username, password) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`username "${username}" not found`)
			sql = `SELECT id, pass FROM users WHERE user = "${username}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(password, record.pass)
			if(valid === false) throw new Error(`invalid password for account "${username}"`)
			return record.id
		} catch(err) {
			throw err
		}
	}

	/**
	 * Gets a username based on an ID.
	 * @param {string} id - The user's ID
	 * @returns {Promise<string>} The ID username
	 */
	async get(id) {
		const sql = `SELECT user FROM users WHERE id=${id}`
		const data = await this.db.get(sql)
		if(data === undefined) throw new Error('user does not exist')
		return data.user
	}

}
