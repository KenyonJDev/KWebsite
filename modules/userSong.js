'use strict'

const sqlite = require('sqlite-async')
const check = require('./songChecks')

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
		await check.user(user)
		await check.song(song)
		const sql = `INSERT INTO userSongs(userID, songID) VALUES("${user}", "${song}")`
		await this.db.run(sql)
		return true
	}

	async get(user) {
		await check.user(user)
		const sql = `SELECT songID FROM userSongs WHERE userID=${user}`
		const data = await this.db.all(sql)
		if(data.length === 0) throw new Error(`user ID ${user} does not exist`)
		return data
	}

	async check(song) {
		await check.song(song)
		const sql = `SELECT userID FROM userSongs WHERE songID=${song}`
		let user = await this.db.get(sql)
		if(user === undefined) throw new Error(`song ID ${song} does not exist`)
		user = user.userID
		return user
	}

	async remove(song) {
		await check.song(song)
		let sql = `SELECT songID FROM userSongs WHERE songID=${song}`
		const data = await this.db.get(sql)
		if(data === undefined) throw new Error(`song ID ${song} does not exist`)
		sql = `DELETE FROM userSongs WHERE songID=${song}`
		await this.db.run(sql)
		return true
	}
}

module.exports = UserSong
