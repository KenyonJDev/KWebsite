'use strict'

const sqlite = require('sqlite-async')
const check = require('./checks')

/**
 * @fileoverview The file where the PlaylistComment class resides.
 * @author Bartlomiej Wlodarski
 */

/**
 * Class representing a playlist comment.
 * Interacts with the database.
 */
class PlaylistComment {
	/**
	 * Comment class constructor.
	 * Leave parameter empty to create db in memory.
	 * @constructor
	 * @param {string} [dbName=:memory:] - The database filename.
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS playlistComments
						(playlistID INTEGER NOT NULL, commentID INTEGER NOT NULL,
						FOREIGN KEY(playlistID) REFERENCES playlists(id)
						FOREIGN KEY(commentID) REFERENCES comments(id)
						PRIMARY KEY(playlistID, commentID))`
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * Links a comment to a playlist.
	 * @async
	 * @param {number} playlistID - The playlist ID.
	 * @param {number} commentID - The comment ID.
	 * @returns {Promise<true>} A confirmation of linkage.
	 */
	async link(playlistID, commentID) {
		await check.playlist(playlistID)
		await check.comment(commentID)
		const sql = `INSERT INTO playlistComments(playlistID, commentID) 
					VALUES("${playlistID}", "${commentID}")`
		await this.db.run(sql)
		return true
	}

	/**
	 * Retrieves a list of a playlist's comments from the database.
	 * @async
	 * @param {number} playlistID - The playlist ID.
	 * @returns {Promise<Array<number>>} A list of comment IDs for the playlist.
	 */
	async get(playlistID) {
		await check.playlist(playlistID)
		const sql = `SELECT commentID FROM playlistComments WHERE playlistID=${playlistID}`
		const data = await this.db.all(sql)
		const keyList = []
		for(const item of data) keyList.push(item.commentID)
		return keyList
	}

	/**
	 * Removes a link between a comment and playlist.
	 * Used when deleting a comment.
	 * @async
	 * @param {number} commentID - The comment ID.
	 * @returns {Promise<true>}
	 */
	async delete(commentID) {
		await check.comment(commentID)
		const sql = `DELETE FROM playlistComments WHERE commentID=${commentID}`
		await this.db.run(sql)
		return true
	}
}

module.exports = PlaylistComment
