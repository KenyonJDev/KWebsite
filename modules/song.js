'use strict'

const check = require('./checks')
const dbManager = require('./dbManager')

/**
 * @fileoverview The file where the Song class resides.
 * @author Bartlomiej Wlodarski
 */

/**
 * Class representing a song.
 * Interacts with the database.
 * @namespace
 */
class Song {
	/**
	 * Song class constructor.
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
		const instance = new Song(db)
		const sql = 'CREATE TABLE IF NOT EXISTS songs' +
					'(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, artist TEXT, year INTEGER)'
		await db.run(sql)
		return instance
	}

	/**
	 * Extracts a song's ID3 tags.
	 * @async
	 * @param {string} path - The song file path.
	 * @param {stirng} type - The file type of the path passed.
	 * @returns {Promise<Tags>} The song's ID3 tags.
	 */
	async extractTags(path, type) {
		await check.file(path)
		await check.type(type)
		const mm = await import('music-metadata')
		const data = await mm.parseFile(path)
		const tags = data.common // 'common' contains the metadata.
		return {title: tags.title, artist: tags.artist, year: tags.year}
	}

	/**
	 * Adds song file path and ID3 tags to the database.
	 * @async
	 * @param {Tags} tags - The song's ID3 tags.
	 * @returns {Promise<number>} The ID of the inserted record.
	 */
	async add(tags) {
		await check.tags(tags)
		const title = check.sanitize(tags.title)
		const artist = check.sanitize(tags.artist)
		let sql = 'INSERT INTO songs(title, artist, year) VALUES(?, ?, ?)'
		await this.db.run(sql, [title, artist, tags.year])
		sql = 'SELECT last_insert_rowid() AS id' // retrieves the last autoincremented ID.
		let key = await this.db.get(sql)
		key = key.id
		return key
	}

	/**
	 * Retrieves a song's data from the database.
	 * @async
	 * @param {number} songID - The song's ID in the database.
	 * @returns {Promise<dbData>} The song's data from the database.
	 */
	async get(songID) {
		await check.song(songID)
		const sql = 'SELECT * FROM songs WHERE id = ?'
		const data = await this.db.get(sql, [songID])
		if(data === undefined) throw new Error(`record for key ${songID} does not exist`)
		return data
	}

	/**
	 * Retrieves all songs from the database.
	 * @async
	 * @returns {Promise<Array<dbData>>} An array of song data from the database.
	 */
	async getAll() {
		const sql = 'SELECT * FROM songs'
		const data = await this.db.all(sql)
		return data
	}

	/**
	 * Deletes a song record from the database.
	 * @async
	 * @param {number} songID - The ID of the record in the database.
	 * @returns {Promise<true>} A confirmation of deletion.
	 */
	async delete(songID) {
		await check.song(songID)
		let sql = 'SELECT COUNT(id) AS num FROM songs WHERE id = ?'
		const count = await this.db.get(sql, [songID])
		if(count.num === 0) throw new Error(`record for key ${songID} does not exist`)
		sql = 'DELETE FROM songs WHERE id = ?'
		await this.db.run(sql, [songID])
		return true
	}

}

module.exports = Song
