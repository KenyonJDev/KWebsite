'use strict'

const PlaylistSongs = require('../modules/Playlist_songs.js')

describe('create()', () => {
	test('adding valid playlist and song ID', async done => {
		expect.assertions(1)
		const playlistsongs = await new PlaylistSongs()
		const result = await playlistsongs.create(1,2)
		await expect(result).toBeTruthy()
		done()
	})

	test('passing no arguments', async done => {
		expect.assertions(2)
		const playlistsongs = await new PlaylistSongs()
		await expect(playlistsongs.create())
			.rejects.toEqual(Error('Playlist ID undefined'))
		await expect(playlistsongs.create(2))
			.rejects.toEqual(Error('Song ID undefined'))
		done()
	})
})

describe('getPlaylistSongs()', () => {
	test('checking valid playlist', async done => {
		expect.assertions(1)
		const playlistsongs = await new PlaylistSongs()
		await playlistsongs.create(1,2)
		const lists = await playlistsongs.getPlaylistSongs(1)
		await expect(lists.length).toEqual(1)
		done()
	})

	test('passing no arguments', async done => {
		expect.assertions(1)
		const playlistsongs = await new PlaylistSongs()
		await playlistsongs.create(1,2)
		await expect(playlistsongs.getPlaylistSongs()).rejects.toEqual(Error('Playlist ID undefined'))
		done()
	})

	test('passing string as ID', async done => {
		expect.assertions(1)
		const playlistsongs = await new PlaylistSongs()
		await playlistsongs.create(1,2)
		const id = 'g'
		await expect(playlistsongs.getPlaylistSongs(id)).rejects.toEqual(Error('Playlist ID has to be integer'))
		done()
	})

	test('passing id smaller than 1', async done => {
		expect.assertions(1)
		const playlistsongs = await new PlaylistSongs()
		await playlistsongs.create(1,2)
		const id = -1
		await expect(playlistsongs.getPlaylistSongs(id)).rejects.toEqual(Error('Playlist ID starts at 1'))
		done()
	})
})

describe('remove()', () => {
	test('removing valid song', async done => {
		expect.assertions(1)
		const playlistsongs = await new PlaylistSongs()
		await playlistsongs.create(1,2)
		await expect(playlistsongs.remove(2)).toBeTruthy()
		done()
	})

	test('removing non existing song', async done => {
		expect.assertions(1)
		const playlistsongs = await new PlaylistSongs()
		await playlistsongs.create(1,2)
		await expect(playlistsongs.remove(3)).rejects.toEqual(Error('Song ID does not exist'))
		done()
	})

	test('passing no arguments', async done => {
		expect.assertions(1)
		const playlistsongs = await new PlaylistSongs()
		await expect(playlistsongs.remove()).rejects.toEqual(Error('Song ID undefined'))
		done()
	})

	test('passing string as ID', async done => {
		expect.assertions(1)
		const playlistsongs = await new PlaylistSongs()
		await playlistsongs.create(1,2)
		const id = 'g'
		await expect(playlistsongs.remove(id)).rejects.toEqual(Error('Song ID has to be integer'))
		done()
	})

	test('passing ID smaller than 1', async done => {
		expect.assertions(1)
		const playlistsongs = await new PlaylistSongs()
		await playlistsongs.create(1,2)
		const id = -1
		await expect(playlistsongs.remove(id)).rejects.toEqual(Error('Song ID starts at 1'))
		done()
	})
})
