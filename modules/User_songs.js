
'use strict'

const sqlite = require('sqlite-async')

module.exports = class userSong {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user songs
			// eslint-disable-next-line max-len
			const sql = 'CREATE TABLE IF NOT EXISTS user_songs (song_id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, FOREIGN KEY(song_id) REFERENCES Songs(song_id), FOREIGN KEY(user) REFERENCES Users(user);'
			await this.db.run(sql)
			return this
		})()
	}

}
