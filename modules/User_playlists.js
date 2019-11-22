'use strict'

const sqlite = require('sqlite-async')

module.exports = class UserPlaylist {

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
		try {
			//let sql = `SELECT COUNT(id) as records FROM playlists WHERE name="${name}";`
			const sql = `INSERT INTO userPlaylists(userID, playlistID) VALUES("${userID}", "${playlistID}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async check(playlist) {
		const sql = `SELECT userID FROM userPlaylists WHERE playlistID=${playlist}`
		let user = await this.db.get(sql)
		if(user === undefined) throw new Error(`playlist ID ${playlist} does not exist`)
		user = user.id
		return user
	}
}
