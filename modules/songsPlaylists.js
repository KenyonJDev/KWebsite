'use strict'

const dbManager = require('./dbManager')

module.exports = class PlaylistSongs {

	constructor(db) {
		if (typeof db === 'string' || db === undefined) {
			return this.constructor.create(db)
		}
		this.db = db
	}

	static async create(dbName = ':memory:') {
		const db = await dbManager.get(dbName)
		const instance = new PlaylistSongs(db)
		const sql = `CREATE TABLE IF NOT EXISTS playlistSongs (
			playlistID INTEGER, 
			songID INTEGER, 
			FOREIGN KEY(playlistID) REFERENCES playlists(id), 
			FOREIGN KEY(songID) REFERENCES songs(id),
			PRIMARY KEY(playlistID, songID));`
		await db.run(sql)
		return instance
	}

	async create(playlistID, songID) {
		try {
			const sql = 'INSERT INTO playlistSongs(playlistID, songID) VALUES(?, ?);'
			await this.db.run(sql, [playlistID, songID])
			return true
		} catch(err) {
			throw err
		}
	}
}
