'use strict'

const check = require('./checks')
const dbManager = require('./dbManager')

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
		const instance = new PlaylistComment(db)
		const sql = `CREATE TABLE IF NOT EXISTS playlistComments
					(playlistID INTEGER NOT NULL, commentID INTEGER NOT NULL,
					FOREIGN KEY(playlistID) REFERENCES playlists(id)
					FOREIGN KEY(commentID) REFERENCES comments(id)
					PRIMARY KEY(playlistID, commentID))`
		await db.run(sql)
		return instance
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
		const sql = 'INSERT INTO playlistComments(playlistID, commentID) VALUES(?, ?)'
		await this.db.run(sql, [playlistID, commentID])
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
		const sql = 'SELECT commentID FROM playlistComments WHERE playlistID = ?'
		const data = await this.db.all(sql, [playlistID])
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
		const sql = 'DELETE FROM playlistComments WHERE commentID = ?'
		await this.db.run(sql, [commentID])
		return true
	}
}

module.exports = PlaylistComment
