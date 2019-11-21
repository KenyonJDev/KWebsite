'use strict'

const sqlite = require('sqlite-async')
const userPlaylists = require('./User_playlists')
const user = require('./user')
//const playlistSong = require('./Playlist_songs')

/**
 * @fileoverview The file where the Playlist class resides.
 * @author Joshua Kenyon <KenyonJ@uni.coventry.ac.uk>
 * @author Bartlomiej Wlodarski

/**
 * Interacts with the database.
 * Class representing a Playlist.
 * @namespace
 */


class Playlists {
	/**
	 * Playlist class constructor.
	 * Leave parameter empty to create db in memory.
	 * @constructor
	 * @param {string} [dbName=:memory:] - The database filename.
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// Creation of Playlists table
			const sql = 'CREATE TABLE IF NOT EXISTS playlists' +
						'(playlist_id INTEGER PRIMARY KEY AUTOINCREMENT,' +
						'name TEXT NOT NULL, description TEXT NOT NULL);'
			await this.db.run(sql)
			return this
		})()
	}
	/**
	 * Creates playlist record.
	 * @async
	 * @param {name, description} filePath - new filepath .
	 * @returns {Promise} new playlist entry.
	 * @memberof Playlists
	 */
	async create(name, description) {
		try {
			if(name.length === 0) throw new Error('missing name')
			if(description.length === 0) throw new Error('missing description')
			//let sql = `SELECT COUNT(id) as records FROM playlists WHERE name="${name}";`
			const sql = `INSERT INTO playlists(name, description) VALUES("${name}", "${description}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async getplaylistID(name) {
		const sql = `SELECT playlist_id FROM playlists WHERE name="${name}"`
		const playlistID = await this.db.run(sql)
		return playlistID
	}
	/**
	 * Extracts a song's ID3 tags.
	 * @async
	 * @param {string} filePath - The playlistfile path.
	 * @returns {null} Deletion of record.
	 * @memberof Playlists
	 */
	async delete(name, description) {
		try {
			let sql = `SELECT COUNT(id) as records FROM playlists WHERE name="${name}";`
			sql = `DELETE FROM playlists(name, description) VALUES("${name}", "${description}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}
}

module.exports = Playlists
