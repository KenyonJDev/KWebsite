'use strict'

const sqlite = require('sqlite-async')

module.exports = class Playlists {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user songs
			const sql = 'CREATE TABLE IF NOT EXISTS playlists (playlist_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT;'
			await this.db.run(sql)
			return this
		})()
	}

}