
'use strict'

const Accounts = require('../modules/accounts.js')

describe('register()', () => {
	test('register a valid account', async done => {
		expect.assertions(1)
		try {
			const account = await new Accounts()
			// test goes here
		} catch(err) {
			done.fail(err)
		} finally {
			done()
		}
	})
})

describe('login()', () => {
	test('log in with valid credentials', done => {
		expect.assertions(1)
		try {
			const account = await new Accounts()
			// test goes here
		} catch(err) {
			done.fail(err)
		} finally {
			done()
		}
	})
})

describe('checkCredentials()', () => {
	test('check valid credentials', done => {
		expect.assertions(1)
		try {
			const account = await new Accounts()
			// test goes here
		} catch(err) {
			done.fail(err)
		} finally {
			done()
		}
	})
})
