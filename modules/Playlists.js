'use strict'

const check = require('./checks')
const dbManager = require('./dbManager')
//const playlistSong = require('./Playlist_songs')

/**
 * @fileoverview The file where the Playlist class resides.
 * @author Joshua Kenyon <KenyonJ@uni.coventry.ac.uk>
 * @author Bartlomiej Wlodarski
 * @author Tiago Ferreira

/**
 * Interacts with the database.
 * Class representing a Playlist.
 * @namespace
 */


class Playlists {
	/**
	 * Playlist class constructor.
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
		const instance = new Playlists(db)
		const sql = 'CREATE TABLE IF NOT EXISTS playlists' +
					'(id INTEGER PRIMARY KEY AUTOINCREMENT,' +
					'playlistName TEXT NOT NULL, description TEXT NOT NULL);'
		await db.run(sql)
		return instance
	}
	/**
	 * Creates a playlist.
	 * @param {string} name - The playlist name.
	 * @param {string} description - The playlist description.
	 */
	async create(name, description) {
		try {
			if(name.length === 0) throw new Error('missing name')
			if(description.length === 0) throw new Error('missing description')
			
			name = check.sanitize(name)
			description = check.sanitize(description)

			let sql = 'INSERT INTO playlists(playlistName, description) VALUES(?, ?);'
			await this.db.run(sql, [name, description])
			sql = 'SELECT last_insert_rowid() AS id'
			let playlist = await this.db.get(sql)
			playlist = playlist.id
			return playlist
		} catch(err) {
			throw err
		}
	}

	/**
	 * Gets a playlist record.
	 * @async
	 * @param {number} ID - ID of selected playlist.
	 * @returns {Promise<number>} - Selected Playlist.
	 */
	async getPlaylist(playlistID) {
		if(playlistID === undefined) throw new Error('Playlist ID undefined')
		const sql = 'SELECT * FROM playlists WHERE id = ?'
		const data = await this.db.get(sql, [playlistID])
		return data
	}
	/*
	async getPlaylistDetails(playlistID) {
		if(playlistID === undefined) throw new Error('Playlist ID undefined')
		const sql = `SELECT id FROM playlists WHERE id=${playlistID}`
		const playlists = await this.db.run(sql)
		const list = []
		for(const pl of playlists) list.push(pl.playlistName)
		return list
	}*/

	/**
	 * Gets all playlist records.
	 * @async
	 * @returns {Promise<Array<number>>} - All playlists in database.
	 */
	async getAll() {
		const sql = 'SELECT * FROM playlists'
		const data = await this.db.all(sql)
		return data
	}

	/**
	 * Deletes a playlist record.
	 * @async
	 * @param {number} id - ID of selected playlist.
	 * @returns {Promise<True>} - Confirms deletion of Playlist.
	 */
	async delete(id) {
		if(id === undefined) throw new Error('Playlist ID undefined')
		if(isNaN(id)) throw new Error(`Playlist ID ${id} must be a number`)
		if(id < 1) throw new Error(`Playlist ID ${id} has to be 1 or bigger`)
		const sql = 'DELETE FROM playlists WHERE id = ?'
		await this.db.run(sql, [id])
		return true
	}
}

module.exports = Playlists
