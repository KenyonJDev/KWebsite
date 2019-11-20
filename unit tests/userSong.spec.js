'use strict'

const UserSong = require('../modules/userSong')

describe('linkSong()', () => {
	test('adding valid user and song', async done => {
		expect.assertions(1)
		const us = await new UserSong()
		await expect(us.link(1,2)).toBeTruthy()
		done()
	})

/* 	test('adding with missing params', async done => {

	}) */
})
