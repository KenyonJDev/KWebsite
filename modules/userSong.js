'use strict'

const sqlite = require('sqlite-async')
const check = require('./checks')

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
	 * Links the User and Song tables.
	 * @constructor
	 * @param {string} [dbName=:memory:] - The database filename.
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = 'CREATE TABLE IF NOT EXISTS userSongs' +
						'(userID INTEGER NOT NULL, songID INTEGER NOT NULL,' +
						'FOREIGN KEY(userID) REFERENCES users(id),' +
						'FOREIGN KEY(songID) REFERENCES songs(id),' +
						'PRIMARY KEY(userID, songID))'
			await this.db.run(sql)
			return this
		})()
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
		const sql = `INSERT INTO userSongs(userID, songID) VALUES("${user}", "${song}")`
		await this.db.run(sql)
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
		const sql = `SELECT songID FROM userSongs WHERE userID=${user}`
		const data = await this.db.all(sql)
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
		const sql = `SELECT userID FROM userSongs WHERE songID=${song}`
		let user = await this.db.get(sql)
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
		let sql = `SELECT songID FROM userSongs WHERE songID=${song}`
		const data = await this.db.get(sql)
		if(data === undefined) throw new Error(`song ID ${song} does not exist`)
		sql = `DELETE FROM userSongs WHERE songID=${song}`
		await this.db.run(sql)
		return true
	}
}

module.exports = UserSong
