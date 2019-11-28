
'use strict'

const Playlist = require('../modules/Playlists.js')

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

describe('get()', () => {
	test('retrieving valid playlist', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		//const create = playlist.create('Playlist', 'Description')
		await playlist.create('test name', 'test desc')
		const list = await playlist.getPlaylist(1)
		await expect(list.playlistName).toEqual('test name')
		done()
	})

	test('passing no id', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		await expect(playlist.getPlaylist()).rejects.toEqual(Error('Playlist ID undefined'))
		done()
	})
})

describe('getAll()', () => {
	test('expecting empty object', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		const list = await playlist.getAll()
		await expect(list).toEqual([])
		done()
	})
})

describe('delete()', () => {

	test('deleting a valid playlist', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		//await playlist.create('Playlist' ,'Description')
		const id = 1
		//const confirm = await playlist.delete(id)
		await expect(await playlist.delete(id)).toEqual(true)
		done()
	})

	test('deleting non existing paylist', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		const id = 1
		await expect(playlist.delete()).rejects.toEqual(Error('Playlist ID undefined'))
		done()
	})

	test('passing invalid argument', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		const id = 'a'
		await expect(playlist.delete(id)).rejects.toEqual(Error(`Playlist ID ${id} must be a number`))
		done()
	})

	test('passing number smaller than 1', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		const id = 0
		await expect(playlist.delete(id)).rejects.toEqual(Error(`Playlist ID ${id} has to be 1 or bigger`))
		done()
	})
})
