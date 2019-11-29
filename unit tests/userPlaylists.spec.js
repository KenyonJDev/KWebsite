'use strict'

const UserPlaylist = require('../modules/User_playlists.js')

describe('create()', () => {

	test('adding valid user and playlist', async done => {
		expect.assertions(1)
		const userplaylist = await new UserPlaylist()
		const result = await userplaylist.create(1,2)
		await expect(result).toBeTruthy()
		done()
	})

	test('passing no arguments', async done => {
		expect.assertions(2)
		const userplaylist = await new UserPlaylist()
		await expect(userplaylist.create()).rejects.toEqual(Error('User ID undefined'))
		await expect(userplaylist.create(2)).rejects.toEqual(Error('Playlist ID undefined'))
		done()
	})
})

describe('check()', () => {

	test('checking valid playlist ID', async done => {
		expect.assertions(1)
		const userplaylists = await new UserPlaylist()
		await userplaylists.create(1,2)
		const owner = await userplaylists.check(2)
		await expect(owner).toEqual(1)
		done()
	})

	test('passing no playlist ID', async done => {
		expect.assertions(1)
		const userplaylist = await new UserPlaylist()
		await userplaylist.create(1,2)
		await expect(userplaylist.check()).rejects.toEqual(Error('Playlist is undefined'))
		done()
	})


})

describe('getUserPlaylist()', () => {

	test('getting valid user playlists', async done => {
		expect.assertions(2)
		const userplaylist = await new UserPlaylist()
		await userplaylist.create(1,2)
		let lists = await userplaylist.getUserPlaylists(1)
		await expect(lists.length).toEqual(1)
		await userplaylist.create(1,3)
		lists = await userplaylist.getUserPlaylists(1)
		await expect(lists.length).toEqual(2)
		done()
	})

	test('passing no argument', async done => {
		expect.assertions(1)
		const userplaylist = await new UserPlaylist()
		await userplaylist.create(1,2)
		await expect(userplaylist.getUserPlaylists()).rejects.toEqual(Error('User ID undefined'))
		done()
	})

	test('passing string as ID', async done => {
		expect.assertions(1)
		const userplaylist = await new UserPlaylist()
		await userplaylist.create(1,2)
		const lists = 'g'
		await expect(userplaylist.getUserPlaylists(lists)).rejects.toEqual(Error('User ID has to be integer'))
		done()
	})

	test('using ID smaller than 1', async done => {
		expect.assertions(1)
		const userplaylist = await new UserPlaylist()
		await userplaylist.create(1,2)
		const id = 0
		await expect(userplaylist.getUserPlaylists(id)).rejects.toEqual(Error('User ID starts at 1'))
		done()
	})
})

describe('remove()', () => {

	test('removing user playlist', async done => {
		expect.assertions(1)
		const userplaylist = await new UserPlaylist()
		await userplaylist.create(1,2)
		const confirm = await userplaylist.remove(2)
		await expect(confirm).toEqual(true)
		done()
	})

	test('removing playlist that does not exist', async done => {
		expect.assertions(1)
		const userplaylist = await new UserPlaylist()
		const invalidID = 1
		await expect(userplaylist.remove(invalidID))
			.rejects.toEqual(Error('Playlist ID does not exist'))
		done()
	})

	test('passing ID smaller than 1', async done => {
		expect.assertions(1)
		const userplaylist = await new UserPlaylist()
		await userplaylist.create(1,2)
		await expect(userplaylist.remove(-1))
			.rejects.toEqual(Error('Playlist ID starts at 1'))
		done()
	})

	test('passing no argument', async done => {
		expect.assertions(1)
		const userplaylist = await new UserPlaylist()
		await expect(userplaylist.remove())
			.rejects.toEqual(Error('Playlist ID undefined'))
		done()
	})
})
