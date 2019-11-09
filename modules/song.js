'use strict'

const sqlite = require('sqlite-async')
const mm = require('music-metadata')
const fs = require('fs')
const path = require('path')

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
	 * A song's ID3 tags.
	 * @typedef {Object} Tags
	 * @property {string} title - The title.
	 * @property {string} artist - The artist.
	 * @property {number} year - The release year.
	 */

	/**
	 * Adds a song's ID3 tags to the database.
	 * @async
	 * @param {string} filePath - The song file path.
	 * @returns {Promise<Tags>} The song's ID3 Tags.
	 */
	async add(filePath) {
		try {
			if(filePath === undefined) throw new Error('no arguments passed')
			if(!fs.existsSync(filePath)) throw new Error(`file '${filePath}' does not exist`)
			if(path.extname(filePath) !== '.mp3') throw new Error(`file '${filePath}' is not an .mp3 file`)
			const data = await mm.parseFile(filePath)
			const tags = data.common // 'common' contains the metadata.
			const file = path.parse(filePath).base // base contanis the file name with extension.
			const sql = `INSERT INTO songs(file, title, artist, year) \
						VALUES("${file}", "${tags.title}", "${tags.artist}", "${Number(tags.year)}")`
			await this.db.run(sql)
			return {title: tags.title, artist: tags.artist, year: tags.year}
		} catch(err) {
			throw err
		}
	}

	/**
	 * A song's data retrieved from the database.
	 * @typedef {Object} dbData
	 * @property {number} id - The ID of the song in the database.
	 * @property {string} file - The name of the song file.
	 * @property {string} title - The title of the song.
	 * @property {string} artist - The song's artist.
	 * @property {number} year - The song's release year.
	 */

	/**
	 * Retrieves a song's data from the database.
	 * @async
	 * @param {number} key - The song's ID in the database.
	 * @returns {Promise<dbData>} The song's data from the database.
	 */
	async get(key) {
		try {
			if(key === undefined) throw new Error('no arguments passed')
			const id = Number(key)
			if(isNaN(id)) throw new Error(`'${key}' is not a number`)
			const sql = `SELECT * FROM songs WHERE id="${id}"`
			const data = await this.db.get(sql)
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
