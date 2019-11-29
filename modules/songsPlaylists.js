'use strict'

const sqlite = require('sqlite-async')

module.exports = class PlaylistSongs {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user songs
			const sql = `CREATE TABLE IF NOT EXISTS playlistSongs (
				playlistID INTEGER, 
				songID INTEGER, 
				FOREIGN KEY(playlistID) REFERENCES playlists(id), 
				FOREIGN KEY(songID) REFERENCES songs(id),
				PRIMARY KEY(playlistID, songID));`
			await this.db.run(sql)
			return this
		})()
	}

	async create(playlistID, songID) {
		try {
			const sql = `INSERT INTO playlistSongs(playlistID, songID) VALUES("${playlistID}", "${songID}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}
}
