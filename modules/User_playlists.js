'use strict'

const sqlite = require('sqlite-async')

module.exports = class UserPlaylist {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user songs
			const sql = `CREATE TABLE IF NOT EXISTS user_playlists(
				playlist_id INTEGER PRIMARY KEY, 
				user_id INTEGER PRIMARY KEY, 
				FOREIGN KEY(playlist_id) REFERENCES Playlists(playlist_id), 
				FOREIGN KEY(user_id) REFERENCES Users(id));`
			await this.db.run(sql)
			return this
		})()
	}

	async add(user) {
		// Use SQLite to add the song ID to the relevant playlist
		
	}

}