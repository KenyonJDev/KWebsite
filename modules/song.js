'use strict'

const sqlite = require('sqlite-async')
const ID3 = require('node-id3')

const musicPath = 'public\\music\\'

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

	async add(fileName) {
		try {
			const path = `${musicPath}${fileName}`
			const data = await ID3.read(path)
			return data
		} catch(err) {
			console.error(err)
		}
	}
}

