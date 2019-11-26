
'use strict'

const Playlist = require('../modules/playlists.js')

describe('create()', () => {

	test('Create a new playlist', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		const create = await playlist.create('Playlist', 'description')
		expect(create).toBe(1)
		done()
	})
	test('test for blank name', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		await expect( playlist.create('', 'description') )
			.rejects.toEqual( Error('missing name') )
		done()
	})

	test('test for blank description', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		await expect( playlist.create('Playlist', '') )
			.rejects.toEqual( Error('missing description') )
		done()
	})
})
/*
describe('get()', () => {
	test('retrieving valid playlist', async done => {
		expect.assertions(1)
		const playlist = new Playlist()
		//const create = playlist.create('Playlist', 'Description')
		const id = 1
		const confirm = await playlist.get(id)
		await expect(confirm).toEqual('1', 'test name', 'test description')
		done()
	})
})*/
/*
describe('delete()', () => {

	test('deleting a valid playlist', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		//await playlist.create('Playlist' ,'Description')
		const id = 1
		const confirm = await playlist.delete(id)
		await expect(confirm).toEqual(true)
		done()
	})
})*/
