'use strict'

const sqlite = require('sqlite-async')

/**
 * @fileoverview The file where the PlaylistSong class resides.
 * @author Joshua Kenyon <KenyonJ@uni.coventry.ac.uk>
 */

/**
 * Interacts with the database.
 * @namespace
 */

module.exports = class PlaylistSong {
/**
	 * PlaylistSong class constructor.
	 * Leave parameter empty to create db in memory.
	 * @constructor
	 * @param {string} [dbName=:memory:] - The database filename.
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			//Creates Playlist_songs table
			const sql = `CREATE TABLE IF NOT EXISTS playlist_songs (
				playlist_id INTEGER PRIMARY KEY, 
				Song_id INTEGER,
				FOREIGN KEY(playlist_id) REFERENCES Playlists(playlist_id), 
				FOREIGN KEY(Song_id) REFERENCES songs(song_id));`
			await this.db.run(sql)
			return this
		})()

	}

}
