
'use strict'

const Accounts = require('../modules/user.js')

describe('register()', () => {

	test('register a valid account', async () => {
		expect.assertions(1)
		const account = await Accounts.create()
		const register = await account.register('doej', 'password')
		expect(register).toBe(true)
	})

	test('register a duplicate username', async () => {
		expect.assertions(1)
		const account = await Accounts.create()
		await account.register('doej', 'password')
		await expect( account.register('doej', 'password') )
			.rejects.toEqual( Error('username "doej" already in use') )
	})

	test('error if blank username', async () => {
		expect.assertions(1)
		const account = await Accounts.create()
		await expect( account.register('', 'password') )
			.rejects.toEqual( Error('missing username') )
	})

	test('error if blank password', async () => {
		expect.assertions(1)
		const account = await Accounts.create()
		await expect( account.register('doej', '') )
			.rejects.toEqual( Error('missing password') )
	})

})

describe('login()', () => {
	test('log in with valid credentials', async () => {
		expect.assertions(1)
		const account = await Accounts.create()
		await account.register('doej', 'password')
		const id = await account.login('doej', 'password')
		expect(id).toBe(1)
	})

	test('invalid username', async () => {
		expect.assertions(1)
		const account = await Accounts.create()
		await account.register('doej', 'password')
		await expect( account.login('roej', 'password') )
			.rejects.toEqual( Error('username "roej" not found') )
	})

	test('invalid password', async () => {
		expect.assertions(1)
		const account = await Accounts.create()
		await account.register('doej', 'password')
		await expect( account.login('doej', 'bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
	})

})

describe('get()', () => {
	test('getting valid user ID', async () => {
		expect.assertions(1)
		const account = await Accounts.create()
		await account.register('doej', 'password')
		const username = await account.get(1)
		await expect(username).toEqual('doej')
	})

	test('getting invalid ID', async () => {
		expect.assertions(1)
		const account = await Accounts.create()
		await expect(account.get(1))
			.rejects.toEqual(Error('user does not exist'))
	})
})
