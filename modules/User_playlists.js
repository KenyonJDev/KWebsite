'use strict'

module.exports = class UserPlaylist {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user songs
			const sql = 'CREATE TABLE IF NOT EXISTS user_playlists (playlist_id INTEGER PRIMARY KEY, user TEXT, FOREIGN KEY(playlist_id) REFERENCES Playlists(playlist_id), FOREIGN KEY(user) REFERENCES Users(user);'
			await this.db.run(sql)
			return this
		})()
	}

}