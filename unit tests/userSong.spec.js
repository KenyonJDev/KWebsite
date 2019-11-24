'use strict'

const UserSong = require('../modules/userSong.js')

describe('linkSong()', () => {
	test('adding valid user and song', async done => {
		expect.assertions(1)
		const us = await new UserSong()
		const result = await us.link(1,2)
		await expect(result).toBeTruthy()
		done()
	})
	test('using method with missing arguments', async done => {
		expect.assertions(2)
		const us = await new UserSong()
		await expect(us.link()).rejects.toEqual(Error('user ID is undefined'))
		await expect(us.link(1)).rejects.toEqual(Error('song ID is undefined'))
		done()
	})
})

describe('get()', () => {
	test('retrieving valid songs list', async done => {
		expect.assertions(2)
		const us = await new UserSong()
		await us.link(1,2)
		let songs = await us.get(1)
		await expect(songs.length).toEqual(1)
		await us.link(1,3)
		songs = await us.get(1)
		console.log(songs)
		await expect(songs.length).toEqual(2)
		done()
	})
	test('passing invalid user ID', async done => {
		expect.assertions(1)
		const us = await new UserSong()
		const invalidID = 1
		await expect(us.get(invalidID))
			.rejects.toEqual(Error(`user ID ${invalidID} does not exist`))
		done()
	})

	test('passing string as ID', async done => {
		expect.assertions(1)
		const us = await new UserSong()
		const invalidID = ''
		await expect(us.get(invalidID))
			.rejects.toEqual(Error(`provided user ID '${invalidID}' is not a number`))
		done()
	})
})

describe('check()', () => {
	test('checking valid song ID', async done => {
		expect.assertions(1)
		const us = await new UserSong()
		await us.link(1,2)
		const owner = await us.check(2)
		await expect(owner).toEqual(1)
		done()
	})

	test('checking invalid song ID', async done => {
		expect.assertions(1)
		const us = await new UserSong()
		const invalidID = 1
		await expect(us.check(invalidID))
			.rejects.toEqual(Error(`song ID ${invalidID} does not exist`))
		done()
	})
	test('passing no song ID', async done => {
		expect.assertions(1)
		const us = await new UserSong()
		await expect(us.check())
			.rejects.toEqual(Error('song ID is undefined'))
		done()
	})
})

describe('remove()', () => {
	test('removing valid record', async done => {
		expect.assertions(1)
		const us = await new UserSong()
		await us.link(1,2)
		const confirm = await us.remove(2)
		await expect(confirm).toEqual(true)
		done()
	})
	test('removing song that does not exist', async done => {
		expect.assertions(1)
		const us = await new UserSong()
		const invalidID = 2
		await expect(us.remove(invalidID))
			.rejects.toEqual(Error(`song ID ${invalidID} does not exist`))
		done()
	})

	test('passing no ID', async done => {
		expect.assertions(1)
		const us = await new UserSong()
		await expect(us.remove())
			.rejects.toEqual(Error('song ID is undefined'))
		done()
	})

	test('passing string as ID', async done => {
		expect.assertions(1)
		const us = await new UserSong()
		const invalidID = ''
		await expect(us.remove(invalidID))
			.rejects.toEqual(Error(`provided song ID '${invalidID}' is not a number`))
		done()
	})
})
