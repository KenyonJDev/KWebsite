'use strict'

const sqlite = require('sqlite-async')
const user_ID = require('./user')
const playlist_ID = require('./Playlists')

module.exports = class UserPlaylist {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user songs
			const sql = `CREATE TABLE IF NOT EXISTS user_playlists(
				playlist_id INTEGER, 
				user_id INTEGER, 
				FOREIGN KEY(playlist_id) REFERENCES Playlists(playlist_id), 
				FOREIGN KEY(user_id) REFERENCES Users(id));`
			await this.db.run(sql)
			return this
		})()
	}

	async create(user_ID, playlist_ID) {
		try {
			//let sql = `SELECT COUNT(id) as records FROM playlists WHERE name="${name}";`
			const sql = `INSERT INTO user_playlists(playlist_id, user_id) VALUES("${user_ID}", "${playlist_ID}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async add(user) {
		// Use SQLite to add the song ID to the relevant playlist

	}

}
