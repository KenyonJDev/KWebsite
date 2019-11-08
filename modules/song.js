'use strict'

const sqlite = require('sqlite-async')
const metadata = require('music-metadata')

const musicPath = 'public\\music\\'

module.exports = class Song {
	constructor(dbname = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbname)
			// eslint-disable-next-line max-len
			const sql = 'CREATE TABLE IF NOT EXISTS songs(song_id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, artist TEXT, publisher TEXT, year INTEGER)'
			await this.db.run(sql)
			return this
		})()
	}

	async add(fileName) {
		try {
			const path = `${musicPath}${fileName}`
			const data = await metadata.parseFile(path)
			console.log(data)
		} catch(err) {
			console.error(err)
		}
	}
}

