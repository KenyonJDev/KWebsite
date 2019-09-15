
'use strict'

const accounts = require('../../modules/accounts.js')
//jest.mock('sqlite-async')

beforeAll( async() => {
	console.log('Jest starting!')
	// we insert a single user into the database
	const sqlite = require('sqlite-async')
	const bcrypt = require('bcrypt-promise')
	const pass = await bcrypt.hash('goodPassword', 10)
	const db = await sqlite.open('./website.db')
	await db.run('DROP TABLE IF EXISTS users;')
	await db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT);')
	console.log(`INSERT INTO users(user, pass) VALUES("jdoe", "${pass}"`)
	await db.run(`INSERT INTO users(user, pass) VALUES("jdoe", "${pass}")`)
	await db.close()
	console.log('database built')
})

describe('checkCredentials()', () => {
	test('returns true if valid username and password', async done => {
		expect.assertions(1)
		try {
			const result = await accounts.checkCredentials('jdoe', 'goodPassword')
			expect(result).toBe(true)
		} catch(err) {
			console.log(`ERROR: ${err.message}`)
		} finally {
			done()
		}
	})

	test('throws error if invalid username', async done => {
		expect.assertions(1)
		try {
			await accounts.checkCredentials('johndoe', 'goodPassword')
			//expect(result).toBe(true)
		} catch(err) {
			expect(err.message).toBe('invalid username')
		} finally {
			done()
		}
	})

	test('throws error if invalid password', async done => {
		expect.assertions(1)
		try {
			await accounts.checkCredentials('jdoe', 'badPassword')
			//expect(result).toBe(true)
		} catch(err){
			expect(err.message).toBe('invalid password')
		} finally {
			done()
		}
	})
})

describe('addUser()', () => {
	// TODO
})
