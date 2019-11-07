'use strict'

const sqlite = require('sqlite-async')

module.exports = class Song {
	constructor(dbname = ':memory:') {
		return async() => {
			this.db = await sqlite.open(dbname)
			// eslint-disable-next-line max-len
			const sql = 'CREATE TABLE IF NOT EXISTS songs(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, artist TEXT, publisher TEXT, year INTEGER)'
			await this.db.run(sql)
			return this
		}
	}
}
