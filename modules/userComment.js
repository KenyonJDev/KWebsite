'use strict'

const sqlite = require('sqlite-async')
const check = require('./checks')

/**
 * @fileoverview The file where the Comment class resides.
 * @author Bartlomiej Wlodarski
 */

/**
 * Class representing a comment.
 * Interacts with the database.
 */
class UserComment {
	/**
	 * Comment class constructor.
	 * Leave parameter empty to create db in memory.
	 * @constructor
	 * @param {string} [dbName=:memory:] - The database filename.
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS userComments
						(userID INTEGER NOT NULL, commentID INTEGER NOT NULL,
						FOREIGN KEY(userID) REFERENCES users(id)
						FOREIGN KEY(commentID) REFERENCES comments(id)
						PRIMARY KEY(userID, commentID))`
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * Links a user to a comment.
	 * @async
	 * @param {number} userID - The user ID.
	 * @param {number} commentID - The comment ID.
	 * @returns {Promise<true>} A confirmation of linkage.
	 */
	async link(userID, commentID) {
		await check.user(userID)
		await check.comment(commentID)
		const sql = `INSERT INTO userComments(userID, commentID) 
					VALUES("${userID}", "${commentID}")`
		await this.db.run(sql)
		return true
	}

	/**
	 * Retrieves owner ID of a comment.
	 * @async
	 * @param {number} commentID - The comment ID.
	 * @returns {Promise<number>} The comment owner ID.
	 */
	async getOwner(commentID) {
		await check.comment(commentID)
		const sql = `SELECT userID FROM userComments WHERE commentID=${commentID}`
		const data = await this.db.get(sql)
		const owner = data.userID
		return owner
	}

	/**
	 * Unlinks a comment from a user.
	 * Used before deleting a comment.
	 * @async
	 * @param {number} commentID - The comment ID.
	 * @returns {Promise<true>} Confirmation of deletion.
	 */
	async delete(commentID) {
		await check.comment(commentID)
		const sql = `DELETE FROM userComments WHERE commentID=${commentID}`
		await this.db.run(sql)
		return true
	}
}

module.exports = UserComment
