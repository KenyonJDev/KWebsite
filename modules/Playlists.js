'use strict'

const sqlite = require('sqlite-async')
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
	 * Leave parameter empty to create db in memory.
	 * @constructor
	 * @param {string} [dbName=:memory:] - The database filename.
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// Creation of Playlists table
			const sql = 'CREATE TABLE IF NOT EXISTS playlists' +
						'(id INTEGER PRIMARY KEY AUTOINCREMENT,' +
						'playlistName TEXT NOT NULL, description TEXT NOT NULL);'
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
			let sql = `INSERT INTO playlists(playlistName, description) VALUES("${name}", "${description}");`
			await this.db.run(sql)
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
	 * @param {playlistID} ID - ID of selected playlist.
	 * @returns {ID} - Selected Playlist.
	 * @memberof Playlists
	 */
	async getPlaylist(playlistID) {
		if(playlistID === undefined) throw new Error('Playlist ID undefined')
		const sql = `SELECT * FROM playlists WHERE id=${playlistID}`
		const data = await this.db.get(sql)
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
	 * @returns {records} - All playlists in database.
	 * @memberof Playlists
	 */
	async getAll() {
		const sql = 'SELECT * FROM playlists'
		const data = await this.db.all(sql)
		return data
	}

	/**
	 * Deletes a playlist record.
	 * @async
	 * @param {playlistID} id - ID of selected playlist.
	 * @returns {Promise<True>} - Confirms deletion of Playlist.
	 * @memberof Playlists
	 */
	async delete(id) {
		if(id === undefined) throw new Error('Playlist ID undefined')
		if(isNaN(id)) throw new Error(`Playlist ID ${id} must be a number`)
		if(id < 1) throw new Error(`Playlist ID ${id} has to be 1 or bigger`)
		const sql = `DELETE FROM playlists WHERE id=${id}`
		await this.db.run(sql)
		return true
	}
}

module.exports = Playlists
