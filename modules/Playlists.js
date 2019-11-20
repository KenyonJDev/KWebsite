'use strict'

const sqlite = require('sqlite-async')
//const playlistSong = require('./Playlist_songs')

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
			// we need this table to store the user songs
			const sql = 'CREATE TABLE IF NOT EXISTS playlists' + 
						'(playlist_id INTEGER PRIMARY KEY AUTOINCREMENT,' + 
						'name TEXT NOT NULL, description TEXT NOT NULL);'
			await this.db.run(sql)
			return this
		})()
	}
	async create(name, description) {
		try {
			if(name.length === 0) throw new Error('missing name')
			if(description.length === 0) throw new Error('missing description')
			//let sql = `SELECT COUNT(id) as records FROM playlists WHERE name="${name}";`
			let sql = `INSERT INTO playlists(name, description) VALUES("${name}", "${description}")`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

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