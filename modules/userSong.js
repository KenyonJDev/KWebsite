'use strict'

const sqlite = require('sqlite-async')

class UserSong {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = 'CREATE TABLE IF NOT EXISTS userSongs' +
						'(userID INTEGER NOT NULL, songID INTEGER NOT NULL,' +
						'FOREIGN KEY(userID) REFERENCES users(id),' +
						'FOREIGN KEY(songID) REFERENCES songs(id),' +
						'PRIMARY KEY(userID, songID))'
			await this.db.run(sql)
			return this
		})()
	}

	async link(user, song) {
		if(user === undefined) throw new Error('user ID is undefined')
		if(song === undefined) throw new Error('song ID is undefined')
		const sql = `INSERT INTO userSongs(userID, songID) VALUES("${user}", "${song}")`
		await this.db.run(sql)
		return true
	}

	async get(user) {
		if(user === undefined) throw new Error('user ID is undefined')
		if(isNaN(user)) throw new Error('user ID is not a number')
		const sql = `SELECT FROM userSongs WHERE userID=${user}`
		const data = await this.db.all(sql)
		return data
	}

	async check(song) {
		if(song === undefined) throw new Error('song ID is undefined')
		const sql = `SELECT userID AS id FROM userSongs WHERE songID=${song}`
		let user = await this.db.get(sql)
		console.log(user)
		user = user.id
		return user
	}

	async remove(song) {
		if(song === undefined) throw new Error('song ID is undefined')
		const sql = `DELETE FROM userSongs WHERE songID=${song}`
		await this.db.run(sql)
		return true
	}
}

module.exports = UserSong
