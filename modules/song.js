'use strict'

const sqlite = require('sqlite-async')
const mm = require('music-metadata')
const fs = require('fs')

module.exports = class Song {
	constructor(dbname = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbname)
			// eslint-disable-next-line max-len
			const sql = 'CREATE TABLE IF NOT EXISTS songs(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, artist TEXT, publisher TEXT, year INTEGER)'
			await this.db.run(sql)
			return this
		})()
	}

	async add(filePath) {
		try {
			if(!fs.existsSync(filePath)) throw new Error(`file '${filePath}' does not exist`)
			const data = await mm.parseFile(filePath)
			return data
		} catch(err) {
			throw err
		}
	}
}

