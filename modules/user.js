
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

}