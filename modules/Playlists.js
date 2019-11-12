'use strict'

const sqlite = require('sqlite-async')

module.exports = class Playlists {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user songs
			const sql = `CREATE TABLE IF NOT EXISTS playlists(
				playlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT,
				description TEXT;`
			await this.db.run(sql)
			return this
		})()
	}
	async create(name, description) {
		try {
			if(name.length === 0) throw new Error('missing name')
			if(description.length === 0) throw new Error('missing description')
			let sql = `SELECT COUNT(id) as records FROM playlists WHERE name="${name}";`
			sql = `INSERT INTO playlists(name, description) VALUES("${name}", "${description}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async delete(name, description) {
		try {
			let sql = `SELECT COUNT(id) as records FROM playlists WHERE name="${name}";`
			sql = `DELETE FROM playlists(name, description) VALUES("${name}", "${description}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}
}
