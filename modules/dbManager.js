'use strict'

const sqlite = require('sqlite-async')

class DatabaseManager {
	constructor() {
		this.connections = {}
	}

	async get(dbName = ':memory:') {
		if (dbName === ':memory:') {
			return await sqlite.open(dbName)
		}
		if (!this.connections[dbName]) {
			this.connections[dbName] = await sqlite.open(dbName)
			await this.connections[dbName].run('PRAGMA foreign_keys = ON;')
			await this.connections[dbName].run('PRAGMA journal_mode = WAL;')
		}
		return this.connections[dbName]
	}
}

module.exports = new DatabaseManager()