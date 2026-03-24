'use strict'

const UserSong = require('../modules/userSong.js')

describe('linkSong()', () => {
	test('adding valid user and song', async () => {
		expect.assertions(1)
		const us = await UserSong.create()
		const result = await us.link(1,2)
		await expect(result).toBeTruthy()
	})
	test('using method with missing arguments', async () => {
		expect.assertions(2)
		const us = await UserSong.create()
		await expect(us.link()).rejects.toEqual(Error('user ID is undefined'))
		await expect(us.link(1)).rejects.toEqual(Error('song ID is undefined'))
	})
})

describe('get()', () => {
	test('retrieving valid songs list', async () => {
		expect.assertions(2)
		const us = await UserSong.create()
		await us.link(1,2)
		let songs = await us.get(1)
		await expect(songs.length).toEqual(1)
		await us.link(1,3)
		songs = await us.get(1)
		console.log(songs)
		await expect(songs.length).toEqual(2)
	})
	test('passing invalid user ID', async () => {
		expect.assertions(1)
		const us = await UserSong.create()
		const data = await us.get(1)
		await expect(data).toEqual([])
	})

	test('passing ID out of range', async () => {
		expect.assertions(1)
		const us = await UserSong.create()
		await expect(us.get(-1))
			.rejects.toEqual(Error('user IDs start at 1'))
	})

	test('passing string as ID', async () => {
		expect.assertions(1)
		const us = await UserSong.create()
		const invalidID = ''
		await expect(us.get(invalidID))
			.rejects.toEqual(Error(`provided user ID '${invalidID}' is not a number`))
	})
})

describe('check()', () => {
	test('checking valid song ID', async () => {
		expect.assertions(1)
		const us = await UserSong.create()
		await us.link(1,2)
		const owner = await us.check(2)
		await expect(owner).toEqual(1)
	})

	test('checking invalid song ID', async () => {
		expect.assertions(1)
		const us = await UserSong.create()
		const invalidID = 1
		await expect(us.check(invalidID))
			.rejects.toEqual(Error(`song ID ${invalidID} does not exist`))
	})
	test('passing no song ID', async () => {
		expect.assertions(1)
		const us = await UserSong.create()
		await expect(us.check())
			.rejects.toEqual(Error('song ID is undefined'))
	})
})

describe('remove()', () => {
	test('removing valid record', async () => {
		expect.assertions(1)
		const us = await UserSong.create()
		await us.link(1,2)
		const confirm = await us.remove(2)
		await expect(confirm).toEqual(true)
	})
	test('removing song that does not exist', async () => {
		expect.assertions(1)
		const us = await UserSong.create()
		const invalidID = 2
		await expect(us.remove(invalidID))
			.rejects.toEqual(Error(`song ID ${invalidID} does not exist`))
	})

	test('passing no ID', async () => {
		expect.assertions(1)
		const us = await UserSong.create()
		await expect(us.remove())
			.rejects.toEqual(Error('song ID is undefined'))
	})

	test('passing string as ID', async () => {
		expect.assertions(1)
		const us = await UserSong.create()
		const invalidID = ''
		await expect(us.remove(invalidID))
			.rejects.toEqual(Error(`provided song ID '${invalidID}' is not a number`))
	})
})
