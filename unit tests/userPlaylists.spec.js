'use strict'

const UserPlaylist = require('../modules/User_playlists.js')

describe('create()', () => {

	test('adding valid user and playlist', async () => {
		expect.assertions(1)
		const userplaylist = await UserPlaylist.create()
		const result = await userplaylist.create(1,2)
		await expect(result).toBeTruthy()
	})

	test('passing no arguments', async () => {
		expect.assertions(2)
		const userplaylist = await UserPlaylist.create()
		await expect(userplaylist.create()).rejects.toEqual(Error('User ID undefined'))
		await expect(userplaylist.create(2)).rejects.toEqual(Error('Playlist ID undefined'))
	})
})

describe('check()', () => {

	test('checking valid playlist ID', async () => {
		expect.assertions(1)
		const userplaylists = await UserPlaylist.create()
		await userplaylists.create(1,2)
		const owner = await userplaylists.check(2)
		await expect(owner).toEqual(1)
	})

	test('passing no playlist ID', async () => {
		expect.assertions(1)
		const userplaylist = await UserPlaylist.create()
		await userplaylist.create(1,2)
		await expect(userplaylist.check()).rejects.toEqual(Error('Playlist is undefined'))
	})


})

describe('getUserPlaylist()', () => {

	test('getting valid user playlists', async () => {
		expect.assertions(2)
		const userplaylist = await UserPlaylist.create()
		await userplaylist.create(1,2)
		let lists = await userplaylist.getUserPlaylists(1)
		await expect(lists.length).toEqual(1)
		await userplaylist.create(1,3)
		lists = await userplaylist.getUserPlaylists(1)
		await expect(lists.length).toEqual(2)
	})

	test('passing no argument', async () => {
		expect.assertions(1)
		const userplaylist = await UserPlaylist.create()
		await userplaylist.create(1,2)
		await expect(userplaylist.getUserPlaylists()).rejects.toEqual(Error('User ID undefined'))
	})

	test('passing string as ID', async () => {
		expect.assertions(1)
		const userplaylist = await UserPlaylist.create()
		await userplaylist.create(1,2)
		const lists = 'g'
		await expect(userplaylist.getUserPlaylists(lists)).rejects.toEqual(Error('User ID has to be integer'))
	})

	test('using ID smaller than 1', async () => {
		expect.assertions(1)
		const userplaylist = await UserPlaylist.create()
		await userplaylist.create(1,2)
		const id = 0
		await expect(userplaylist.getUserPlaylists(id)).rejects.toEqual(Error('User ID starts at 1'))
	})
})

describe('remove()', () => {

	test('removing user playlist', async () => {
		expect.assertions(1)
		const userplaylist = await UserPlaylist.create()
		await userplaylist.create(1,2)
		const confirm = await userplaylist.remove(2)
		await expect(confirm).toEqual(true)
	})

	test('removing playlist that does not exist', async () => {
		expect.assertions(1)
		const userplaylist = await UserPlaylist.create()
		const invalidID = 1
		await expect(userplaylist.remove(invalidID))
			.rejects.toEqual(Error('Playlist ID does not exist'))
	})

	test('passing ID smaller than 1', async () => {
		expect.assertions(1)
		const userplaylist = await UserPlaylist.create()
		await userplaylist.create(1,2)
		await expect(userplaylist.remove(-1))
			.rejects.toEqual(Error('Playlist ID starts at 1'))
	})

	test('passing no argument', async () => {
		expect.assertions(1)
		const userplaylist = await UserPlaylist.create()
		await expect(userplaylist.remove())
			.rejects.toEqual(Error('Playlist ID undefined'))
	})
})
