'use strict'

const sqlite = require('sqlite-async')
const mm = require('music-metadata')
const path = require('path')
const check = require('./songChecks')

/**
 * @fileoverview The file where the Song class resides.
 * @author Bartlomiej Wlodarski
 */

/**
 * Class representing a song.
 * Interacts with the database.
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
						'(id INTEGER PRIMARY KEY AUTOINCREMENT, file TEXT, title TEXT, artist TEXT, year INTEGER)'
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * Extracts a song's ID3 tags.
	 * @async
	 * @param {string} filePath - The song file path.
	 * @returns {Promise<Tags>} The song's ID3 tags.
	 */
	async extractTags(filePath) {
		try {
			await check.file(filePath)
			const data = await mm.parseFile(filePath)
			const tags = data.common // 'common' contains the metadata.
			const file = await path.parse(filePath).base // base contanis the file name with extension.
			return {file: file, title: tags.title, artist: tags.artist, year: tags.year}
		} catch(err) {
			throw err
		}
	}

	/**
	 * Adds song file path and ID3 tags to the database.
	 * @async
	 * @param {string} filePath - The song file path.
	 * @param {Tags} tags - The song's ID3 tags.
	 * @returns {Promise<dbData>} The data added to the database.
	 */
	async add(tags) {
		try {
			await check.tags(tags)
			const sql = `INSERT INTO songs(file, title, artist, year) \
						VALUES("${tags.file}", "${tags.title}", "${tags.artist}", "${tags.year}")`
			await this.db.run(sql)
			return {file: tags.file, title: tags.title, artist: tags.artist, year: tags.year}
		} catch(err) {
			throw err
		}
	}

	/**
	 * Retrieves a song's data from the database.
	 * @async
	 * @param {number} key - The song's ID in the database.
	 * @returns {Promise<dbData>} The song's data from the database.
	 */
	async get(key) {
		try {
			await check.key(key)
			const sql = `SELECT * FROM songs WHERE id="${key}"`
			const data = await this.db.get(sql)
			if(data === undefined) throw new Error(`record for key ${key} does not exist`)
			return data
		} catch(err) {
			throw err
		}
	}

	/**
	 * Retrieves all songs from the database.
	 * @async
	 * @returns {Promise<Array<dbData>>} An array of song data from the database.
	 */
	async getAll() {
		try {
			const sql = 'SELECT * FROM songs'
			const data = await this.db.all(sql)
			return data
		} catch(err) {
			throw err
		}
	}

}

module.exports = Song
