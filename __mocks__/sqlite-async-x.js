
'use strict'

const sqlite = require('sqlite-async')

module.exports.open = function() {
	return {
		all: async sql => {
			console.log(`MOCK ${sql}`)
			const db = await sqlite.open(':memory:')
			await db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT);')
			const user = 'jdoe'
			const pass = '$2b$10$vPqO/uGlKchrQCqyBIKdb.8hLEJgaC4aAg4fpre5rausycX1XmkWy'
			await db.run(`INSERT INTO URLSearchParams(user, pass) VALUES("${user}", "${pass}");`)
			const data = await db.all(sql)
			await db.close()
			return data
		},
		run: async() => true, // we can just ignore these.
		close: async() => true // pretend to close the database.
	}
}
