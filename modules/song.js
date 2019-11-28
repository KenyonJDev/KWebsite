'use strict'

const sqlite = require('sqlite-async')
const mm = require('music-metadata')
const check = require('./checks')

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
	 * Leave parameter empty to create db in memory.
	 * @constructor
	 * @param {string} [dbName=:memory:] - The database filename.
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = 'CREATE TABLE IF NOT EXISTS songs' +
						'(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, artist TEXT, year INTEGER)'
			await this.db.run(sql)
			return this
		})()
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
		let sql = `INSERT INTO songs(title, artist, year) \
					VALUES("${tags.title}", "${tags.artist}", "${tags.year}")`
		await this.db.run(sql)
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
		const sql = `SELECT * FROM songs WHERE id="${songID}"`
		const data = await this.db.get(sql)
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
		let sql = `SELECT COUNT(id) AS num FROM songs WHERE id=${songID}`
		const count = await this.db.get(sql)
		if(count.num === 0) throw new Error(`record for key ${songID} does not exist`)
		sql = `DELETE FROM songs WHERE id=${songID}`
		await this.db.run(sql)
		return true
	}

}

module.exports = Song
