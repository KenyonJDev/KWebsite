
'use strict'

const Playlist = require('../modules/Playlists.js')

describe('create()', () => {

	test('Create a new playlist', async () => {
		expect.assertions(1)
		const playlist = await Playlist.create()
		const create = await playlist.create('Playlist', 'description')
		expect(create).toBe(1)
	})
	test('test for blank name', async () => {
		expect.assertions(1)
		const playlist = await Playlist.create()
		await expect( playlist.create('', 'description') )
			.rejects.toEqual( Error('missing name') )
	})

	test('test for blank description', async () => {
		expect.assertions(1)
		const playlist = await Playlist.create()
		await expect( playlist.create('Playlist', '') )
			.rejects.toEqual( Error('missing description') )
	})
})

describe('get()', () => {
	test('retrieving valid playlist', async () => {
		expect.assertions(1)
		const playlist = await Playlist.create()
		//const create = playlist.create('Playlist', 'Description')
		await playlist.create('test name', 'test desc')
		const list = await playlist.getPlaylist(1)
		await expect(list.playlistName).toEqual('test name')
	})

	test('passing no id', async () => {
		expect.assertions(1)
		const playlist = await Playlist.create()
		await expect(playlist.getPlaylist()).rejects.toEqual(Error('Playlist ID undefined'))
	})
})

describe('getAll()', () => {
	test('expecting empty object', async () => {
		expect.assertions(1)
		const playlist = await Playlist.create()
		const list = await playlist.getAll()
		await expect(list).toEqual([])
	})
})

describe('delete()', () => {

	test('deleting a valid playlist', async () => {
		expect.assertions(1)
		const playlist = await Playlist.create()
		const id = 1
		await expect(playlist.delete(id)).resolves.toEqual(true)
	})

	test('deleting non existing paylist', async () => {
		expect.assertions(1)
		const playlist = await Playlist.create()
		await expect(playlist.delete()).rejects.toEqual(Error('Playlist ID undefined'))
	})

	test('passing invalid argument', async () => {
		expect.assertions(1)
		const playlist = await Playlist.create()
		const id = 'a'
		await expect(playlist.delete(id)).rejects.toEqual(Error(`Playlist ID ${id} must be a number`))
	})

	test('passing number smaller than 1', async () => {
		expect.assertions(1)
		const playlist = await Playlist.create()
		const id = 0
		await expect(playlist.delete(id)).rejects.toEqual(Error(`Playlist ID ${id} has to be 1 or bigger`))
	})
})
