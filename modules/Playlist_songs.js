'use strict'

const dbManager = require('./dbManager')

/**
 * @fileoverview The file where the PlaylistSong class resides.
 * @author Tiago Ferreira
 */

/**
 * Class representing the PlaylistSong table.
 * Interacts with the database.
 * @namespace
 */
class PlaylistSong {
	/**
	 * PlaylistSong class constructor.
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
		const instance = new PlaylistSong(db)
		const sql = `CREATE TABLE IF NOT EXISTS playlistSongs (
			playlistID INTEGER, 
			songID INTEGER,
			FOREIGN KEY(playlistID) REFERENCES playlists(id), 
			FOREIGN KEY(songID) REFERENCES songs(id),
			PRIMARY KEY(playlistID, songID));`
		await db.run(sql)
		return instance
	}

	/**
	 * Populates the table with information regarding the playlist and the song ID.
	 * @async
	 * @param {integer} playlistID  - The ID of the playlist inserted.
	 * @param {integer} songID - The ID of the song inserted
	 * @returns {Promise<True>} - A confirmation of insertion.
	 * @memberof PlaylistSong
	 */
	async create(playlistID, songID) {
		if(playlistID === undefined) throw new Error('Playlist ID undefined')
		if(songID === undefined) throw new Error('Song ID undefined')
		let sql = 'SELECT * FROM playlistSongs WHERE playlistID = ? AND songID = ?'
		const data = await this.db.all(sql, [playlistID, songID])
		if(data.length !== 0) throw new Error('The song is already in this playlist')
		sql = 'INSERT INTO playlistSongs(playlistID, songID) VALUES(?, ?)'
		await this.db.run(sql, [playlistID, songID])
		return true
	}

	/**
	 * Gets all the songs linked to a certain playlist
	 * @async
	 * @param {integer} playlistID - The ID of the playlist
	 * @returns {list} - Returns a list containing all song ids
	 * @memberof PlaylistSong
	 */
	async getPlaylistSongs(playlistID) {
		if(playlistID === undefined) throw new Error('Playlist ID undefined')
		if(isNaN(playlistID)) throw new Error('Playlist ID has to be integer')
		if(playlistID < 1) throw new Error('Playlist ID starts at 1')
		const sql = 'SELECT songID FROM playlistSongs WHERE playlistID = ?'
		const playlist = await this.db.all(sql, [playlistID])
		const list = []
		for(const s of playlist) list.push(s.songID)
		return list
	}

	/**
	 * Removes a song from the database
	 * @async
	 * @param {integer} songID - A song's ID
	 * @returns {Promise<true>} - A confirmation of deletion
	 * @memberof PlaylistSong
	 */
	async remove(songID) {
		if(songID === undefined) throw new Error('Song ID undefined')
		if(isNaN(songID)) throw new Error('Song ID has to be integer')
		if(songID < 1) throw new Error('Song ID starts at 1')
		let sql = 'SELECT songID FROM playlistSongs WHERE songID = ?'
		const data = await this.db.get(sql, [songID])
		if(data === undefined) throw new Error('Song ID does not exist')
		sql = 'DELETE FROM playlistSongs WHERE songID = ?'
		await this.db.run(sql, [songID])
		return true
	}

}

module.exports = PlaylistSong
