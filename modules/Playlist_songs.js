'use strict'

const sqlite = require('sqlite-async')

/**
 * @fileoverview The file where the PlaylistSong class resides.
 * @author Tiago Ferreira
 */

/**
 * Class representing the PlaylistSong table.
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

	/**
	 * Populates the table with information regarding the playlist and the song ID.
	 * @async
	 * @param {integer} playlistID  - The ID of the playlist inserted.
	 * @param {integer} songID - The ID of the song inserted
	 * @returns {Promise<True>} - A confirmation of insertion.
	 */
	async create(playlistID, songID) {
		const sql = `INSERT INTO playlistSongs(playlistID, songID) VALUES("${playlistID}", "${songID}")`
		await this.db.run(sql)
		return true
	}

}
