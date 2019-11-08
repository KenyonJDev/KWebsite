'use strict'

const sqlite = require('sqlite-async')

module.exports = class PlaylistSong {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user songs
			const sql = 'CREATE TABLE IF NOT EXISTS playlist_songs (playlist_id INTEGER PRIMARY KEY, FOREIGN KEY(playlist_id) REFERENCES Playlists(playlist_id), FOREIGN KEY(Song_id) REFERENCES songs(song_id);'
			await this.db.run(sql)
			return this
		})()
	}

}