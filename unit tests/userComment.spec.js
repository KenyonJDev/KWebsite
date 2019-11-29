'use strict'

const UserComment = require('../modules/userComment')

describe('link()', () => {
	test('passing valid data', async done => {
		expect.assertions(1)
		const uc = await new UserComment()
		const confirm = await uc.link(1,2)
		await expect(confirm).toEqual(true)
		done()
	})
	test('out of range parameters', async done => {
		expect.assertions(2)
		const uc = await new UserComment()
		await expect(uc.link(-1,1))
			.rejects.toEqual(Error('user IDs start at 1'))
		await expect(uc.link(1,-1))
			.rejects.toEqual(Error('comment IDs start at 1'))
		done()
	})
	test('using strings as parameters', async done => {
		expect.assertions(2)
		const uc = await new UserComment()
		const invalidID = 'a'
		await expect(uc.link(invalidID,1))
			.rejects.toEqual(Error(`provided user ID '${invalidID}' is not a number`))
		await expect(uc.link(1,invalidID))
			.rejects.toEqual(Error(`provided comment ID '${invalidID}' is not a number`))
		done()
	})
	test('missing a parameter', async done => {
		expect.assertions(2)
		const uc = await new UserComment()
		await expect(uc.link())
			.rejects.toEqual(Error('user ID is undefined'))
		await expect(uc.link(1))
			.rejects.toEqual(Error('comment ID is undefined'))
		done()
	})
})

describe('getOwner()', () => {
	test('using valid ID', async done => {
		expect.assertions(1)
		const uc = await new UserComment()
		const userID = 1, commentID = 2
		await uc.link(userID,commentID)
		const owner = await uc.getOwner(commentID)
		await expect(owner).toEqual(userID)
		done()
	})
	test('using invalid ID', async done => {
		expect.assertions(1)
		const uc = await new UserComment()
		await expect(uc.getOwner(-1))
			.rejects.toEqual(Error('comment IDs start at 1'))
		done()
	})
	test('using NaN', async done => {
		expect.assertions(1)
		const uc = await new UserComment()
		const text = 'a'
		await expect(uc.getOwner(text))
			.rejects.toEqual(Error(`provided comment ID '${text}' is not a number`))
		done()
	})
	test('no argument', async done => {
		expect.assertions(1)
		const uc = await new UserComment()
		await expect(uc.getOwner())
			.rejects.toEqual(Error('comment ID is undefined'))
		done()
	})
})

describe('delete()', () => {
	test('valid ID', async done => {
		expect.assertions(1)
		const uc = await new UserComment()
		await uc.link(1,2)
		const confirm = await uc.delete(2)
		await expect(confirm).toEqual(true)
		done()
	})
	test('out of range ID', async done => {
		expect.assertions(1)
		const uc = await new UserComment()
		await expect(uc.delete(-1))
			.rejects.toEqual(Error('comment IDs start at 1'))
		done()
	})
	test('string as ID', async done => {
		expect.assertions(1)
		const uc = await new UserComment()
		const text = 'a'
		await expect(uc.delete(text))
			.rejects.toEqual(Error(`provided comment ID '${text}' is not a number`))
		done()
	})
	test('no argument', async done => {
		expect.assertions(1)
		const uc = await new UserComment()
		await expect(uc.delete())
			.rejects.toEqual(Error('comment ID is undefined'))
		done()
	})
})
