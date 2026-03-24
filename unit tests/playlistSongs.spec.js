'use strict'

const PlaylistSongs = require('../modules/Playlist_songs.js')

describe('create()', () => {
	test('adding valid playlist and song ID', async () => {
		expect.assertions(1)
		const playlistsongs = await PlaylistSongs.create()
		const result = await playlistsongs.create(1,2)
		await expect(result).toBeTruthy()
	})

	test('passing no arguments', async () => {
		expect.assertions(2)
		const playlistsongs = await PlaylistSongs.create()
		await expect(playlistsongs.create())
			.rejects.toEqual(Error('Playlist ID undefined'))
		await expect(playlistsongs.create(2))
			.rejects.toEqual(Error('Song ID undefined'))
	})

	test('adding song already in playlist', async () => {
		expect.assertions(1)
		const playlistSongs = await PlaylistSongs.create()
		await playlistSongs.create(1,2)
		await expect(playlistSongs.create(1,2))
			.rejects.toEqual(Error('The song is already in this playlist'))
	})
})

describe('getPlaylistSongs()', () => {
	test('checking valid playlist', async () => {
		expect.assertions(1)
		const playlistsongs = await PlaylistSongs.create()
		await playlistsongs.create(1,2)
		const lists = await playlistsongs.getPlaylistSongs(1)
		await expect(lists.length).toEqual(1)
	})

	test('passing no arguments', async () => {
		expect.assertions(1)
		const playlistsongs = await PlaylistSongs.create()
		await playlistsongs.create(1,2)
		await expect(playlistsongs.getPlaylistSongs()).rejects.toEqual(Error('Playlist ID undefined'))
	})

	test('passing string as ID', async () => {
		expect.assertions(1)
		const playlistsongs = await PlaylistSongs.create()
		await playlistsongs.create(1,2)
		const id = 'g'
		await expect(playlistsongs.getPlaylistSongs(id)).rejects.toEqual(Error('Playlist ID has to be integer'))
	})

	test('passing id smaller than 1', async () => {
		expect.assertions(1)
		const playlistsongs = await PlaylistSongs.create()
		await playlistsongs.create(1,2)
		const id = -1
		await expect(playlistsongs.getPlaylistSongs(id)).rejects.toEqual(Error('Playlist ID starts at 1'))
	})
})

describe('remove()', () => {
	test('removing valid song', async () => {
		expect.assertions(1)
		const playlistsongs = await PlaylistSongs.create()
		await playlistsongs.create(1,2)
		await expect(playlistsongs.remove(2)).toBeTruthy()
	})

	test('removing non existing song', async () => {
		expect.assertions(1)
		const playlistsongs = await PlaylistSongs.create()
		await playlistsongs.create(1,2)
		await expect(playlistsongs.remove(3)).rejects.toEqual(Error('Song ID does not exist'))
	})

	test('passing no arguments', async () => {
		expect.assertions(1)
		const playlistsongs = await PlaylistSongs.create()
		await expect(playlistsongs.remove()).rejects.toEqual(Error('Song ID undefined'))
	})

	test('passing string as ID', async () => {
		expect.assertions(1)
		const playlistsongs = await PlaylistSongs.create()
		await playlistsongs.create(1,2)
		const id = 'g'
		await expect(playlistsongs.remove(id)).rejects.toEqual(Error('Song ID has to be integer'))
	})

	test('passing ID smaller than 1', async () => {
		expect.assertions(1)
		const playlistsongs = await PlaylistSongs.create()
		await playlistsongs.create(1,2)
		const id = -1
		await expect(playlistsongs.remove(id)).rejects.toEqual(Error('Song ID starts at 1'))
	})
})
