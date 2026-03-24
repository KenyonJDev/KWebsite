'use strict'

const check = require('./checks')
const dbManager = require('./dbManager')

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
		const instance = new UserComment(db)
		const sql = `CREATE TABLE IF NOT EXISTS userComments
					(userID INTEGER NOT NULL, commentID INTEGER NOT NULL,
					FOREIGN KEY(userID) REFERENCES users(id)
					FOREIGN KEY(commentID) REFERENCES comments(id)
					PRIMARY KEY(userID, commentID))`
		await db.run(sql)
		return instance
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
		const sql = 'INSERT INTO userComments(userID, commentID) VALUES(?, ?)'
		await this.db.run(sql, [userID, commentID])
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
		const sql = 'SELECT userID FROM userComments WHERE commentID = ?'
		const data = await this.db.get(sql, [commentID])
		if(data === undefined) throw new Error(`comment ID ${commentID} does not exist`)
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
		const sql = 'DELETE FROM userComments WHERE commentID = ?'
		await this.db.run(sql, [commentID])
		return true
	}
}

module.exports = UserComment
