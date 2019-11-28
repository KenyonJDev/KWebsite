'use strict'

const sqlite = require('sqlite-async')

module.exports = class UserPlaylist {
	/**
	 * UserPlaylist class constructor.
	 * Leave parameter empty to create db in memory.
	 * @constructor
	 * @param {string} [dbName=:memory:] - The database filename.
	 */

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user songs
			const sql = `CREATE TABLE IF NOT EXISTS userPlaylists(
				userID INTEGER, 
				playlistID INTEGER, 
				FOREIGN KEY(playlistID) REFERENCES playlists(id), 
				FOREIGN KEY(userID) REFERENCES users(id),
				PRIMARY KEY(userID, playlistID));`
			await this.db.run(sql)
			return this
		})()
	}

	async create(userID, playlistID) {
		if(userID === undefined) throw new Error('User ID undefined')
		if(playlistID === undefined) throw new Error('Playlist ID undefined')
		const sql = `INSERT INTO userPlaylists(userID, playlistID) VALUES("${userID}", "${playlistID}");`
		await this.db.run(sql)
		return true
	}

	async check(playlist) {
		if(playlist === undefined) throw new Error('Playlist is undefined')
		const sql = `SELECT userID AS id FROM userPlaylists WHERE playlistID=${playlist}`
		let user = await this.db.get(sql)
		if(user === undefined) throw new Error(`playlist ID ${playlist} does not exist`)
		user = user.id
		return user
	}
/*
	async getPlaylists(userID) {
		if(userID === undefined) throw new Error('User ID undefined')
		if(isNaN(userID)) throw new Error('User ID has to be an integer')
		if(userID < 1) throw new Error('User ID starts at 1')
		const sql = `SELECT * FROM userPlaylists WHERE userID=${userID}`
		const playlists = await this.db.all(sql)
		const total = []
		playlists.forEach(playlist => total.push(playlist.playlistID))
		//playlists = playlists.playlistID
		return total
	}*/

	async getUserPlaylists(userID) {
		if(userID === undefined) throw new Error('User ID undefined')
		if(isNaN(userID)) throw new Error('User ID has to be integer')
		if(userID < 1) throw new Error('User ID starts at 1')
		const sql = `SELECT playlistID FROM userPlaylists WHERE userID=${userID}`
		const playlists = await this.db.all(sql)
		const list = []
		for(const pl of playlists) list.push(pl.playlistID)
		/*const sql = `SELECT * FROM playlists WHERE id IN (\
						SELECT playlistID FROM userPlaylists WHERE userID=${userID})`
		const playlists = await this.db.all(sql)*/
		return list
	}

	async remove(playlistID) {
		if(playlistID === undefined) throw new Error('Playlist ID undefined')
		if(playlistID < 1) throw new Error('Playlist ID starts at 1')
		let sql = `SELECT playlistID FROM userPlaylists WHERE playlistID=${playlistID}`
		const data = await this.db.get(sql)
		if(data === undefined) throw new Error('Playlist ID does not exist')
		sql = `DELETE FROM userPlaylists WHERE playlistID=${playlistID}`
		await this.db.run(sql)
		return true
	}
}
