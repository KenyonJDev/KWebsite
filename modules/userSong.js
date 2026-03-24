'use strict'

const check = require('./checks')
const dbManager = require('./dbManager')

/**
 * @fileoverview The file where the UserSong class resides.
 * @author Bartlomiej Wlodarski
 */

/**
 * The UserSong class: a link table for User and Song.
 */
class UserSong {
	/**
	 * UserSong class constructor.
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
		const instance = new UserSong(db)
		const sql = 'CREATE TABLE IF NOT EXISTS userSongs' +
					'(userID INTEGER NOT NULL, songID INTEGER NOT NULL,' +
					'FOREIGN KEY(userID) REFERENCES users(id),' +
					'FOREIGN KEY(songID) REFERENCES songs(id),' +
					'PRIMARY KEY(userID, songID))'
		await db.run(sql)
		return instance
	}

	/**
	 * Links a user to a song in the database.
	 * @async
	 * @param {number} user - The user's ID.
	 * @param {number} song - The song's ID.
	 * @returns {Promise<true>} A confirmation of link creation.
	 */
	async link(user, song) {
		await check.user(user)
		await check.song(song)
		const sql = 'INSERT INTO userSongs(userID, songID) VALUES(?, ?)'
		await this.db.run(sql, [user, song])
		return true
	}

	/**
	 * Retrieves a list of a user's uploaded songs.
	 * @async
	 * @param {number} user - The user's ID.
	 * @returns {Promise<Array<number>>} An array of the user's song IDs.
	 */
	async get(user) {
		await check.user(user)
		const sql = 'SELECT songID FROM userSongs WHERE userID = ?'
		const data = await this.db.all(sql, [user])
		return data
	}

	/**
	 * Checks the owner of a song.
	 * @async
	 * @param {number} song - The ID of the song.
	 * @returns {Promise<number>} The ID of the song owner.
	 */
	async check(song) {
		await check.song(song)
		const sql = 'SELECT userID FROM userSongs WHERE songID = ?'
		let user = await this.db.get(sql, [song])
		if(user === undefined) throw new Error(`song ID ${song} does not exist`)
		user = user.userID
		return user
	}

	/**
	 * Removes a link between a song and user.
	 * @async
	 * @param {id} song - The song ID.
	 * @returns {Promise<true>} A confirmation of deletion.
	 */
	async remove(song) {
		await check.song(song)
		let sql = 'SELECT songID FROM userSongs WHERE songID = ?'
		const data = await this.db.get(sql, [song])
		if(data === undefined) throw new Error(`song ID ${song} does not exist`)
		sql = 'DELETE FROM userSongs WHERE songID = ?'
		await this.db.run(sql, [song])
		return true
	}
}

module.exports = UserSong
