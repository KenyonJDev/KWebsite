'use strict'

const sqlite = require('sqlite-async')

/**
 * @fileoverview The file where the Comment class resides.
 * @author Bartlomiej Wlodarski
 */

/**
 * Class representing a comment.
 * Interacts with the database.
 */
class Comment {
	/**
	 * Comment class constructor.
	 * Leave parameter empty to create db in memory.
	 * @constructor
	 * @param {string} [dbName=:memory:] - The database filename.
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS comments
						(id INTEGER PRIMARY KEY AUTOINCREMENT, comment TEXT)`
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * Adds a comment to the comments table.
	 * @async
	 * @param {string} comment - The comment to be inserted.
	 * @returns {Promise<number>} The ID of the new comment in the database.
	 */
	async add(comment) {
		if(comment === undefined) throw new Error('no comment passed')
		if(comment === '') throw new Error('comment cannot be empty')
		let sql = `INSERT INTO comments(comment) VALUES("${comment}")`
		await this.db.run(sql)
		sql = 'SELECT last_insert_rowid() AS id'
		let id = await this.db.get(sql)
		id = id.id
		return id
	}

	/**
	 * Retrieves a comment from the database.
	 * @async
	 * @param {number} id - The ID of the comment to retrieve.
	 * @returns {Promise<string>} The comment string.
	 */
	async get(id) {
		if(id === undefined) throw new Error('no comment ID passed')
		if(isNaN(id)) throw new Error('comment ID must be a number')
		if(id < 1) throw new Error('comment IDs start at 1')
		const sql = `SELECT comment FROM comments WHERE id=${id}`
		let comment = await this.db.get(sql)
		comment = comment.comment
		return comment
	}

	/**
	 * Deletes a comment in the comments table.
	 * @async
	 * @param {number} id - The comment ID.
	 * @returns {Promise<true>} A confirmation of deletion.
	 */
	async delete(id) {
		if(id === undefined) throw new Error('no ID passed')
		if(isNaN(id)) throw new Error('comment ID must be a number')
		if(id < 1) throw new Error('comment IDs start at 1')
		const sql = `DELETE FROM comments WHERE id=${id}`
		await this.db.run(sql)
		return true
	}
}

module.exports = Comment
