
'use strict'

const bcrypt = require('bcrypt-promise')
const check = require('./checks')
const dbManager = require('./dbManager')
const saltRounds = 10

/**
 * Class representing a song.
 * Interacts with the database.
 */
module.exports = class User {
	/**
	 * User class constructor.
	 * @param {object} db - The database connection instance.
	 */
	constructor(db) {
		if (typeof db === 'string' || db === undefined) {
			return this.constructor.create(db)
		}
		this.db = db
	}

	static async create(dbName = ':memory:') {
		const db = await dbManager.get(dbName)
		const instance = new User(db)
		const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT);'
		await db.run(sql)
		return instance
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
			user = check.sanitize(user)
			let sql = 'SELECT COUNT(id) as records FROM users WHERE user = ?;'
			const data = await this.db.get(sql, [user])
			if(data.records !== 0) throw new Error(`username "${user}" already in use`)
			pass = await bcrypt.hash(pass, saltRounds)
			sql = 'INSERT INTO users(user, pass) VALUES(?, ?)'
			await this.db.run(sql, [user, pass])
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
			username = check.sanitize(username)
			let sql = 'SELECT count(id) AS count FROM users WHERE user = ?;'
			const records = await this.db.get(sql, [username])
			if(!records.count) throw new Error(`username "${username}" not found`)
			sql = 'SELECT id, pass FROM users WHERE user = ?;'
			const record = await this.db.get(sql, [username])
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
		const sql = 'SELECT user FROM users WHERE id = ?'
		const data = await this.db.get(sql, [id])
		if(data === undefined) throw new Error('user does not exist')
		return data.user
	}

}
