    
'use strict'

module.exports = class User_songs {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(user_songs)
			// we need this table to store the user songs
			const sql = 'CREATE TABLE IF NOT EXISTS users (song_id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, FOREIGN KEY(song_id) REFERENCES Songs(song_id), FOREIGN KEY(user) REFERENCES Users(user);'
			await this.db.run(sql)
			return this
		})()
	}

}