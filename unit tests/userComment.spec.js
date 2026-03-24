'use strict'

const UserComment = require('../modules/userComment')

describe('link()', () => {
	test('passing valid data', async () => {
		expect.assertions(1)
		const uc = await UserComment.create()
		const confirm = await uc.link(1,2)
		await expect(confirm).toEqual(true)
	})
	test('out of range parameters', async () => {
		expect.assertions(2)
		const uc = await UserComment.create()
		await expect(uc.link(-1,1))
			.rejects.toEqual(Error('user IDs start at 1'))
		await expect(uc.link(1,-1))
			.rejects.toEqual(Error('comment IDs start at 1'))
	})
	test('using strings as parameters', async () => {
		expect.assertions(2)
		const uc = await UserComment.create()
		const invalidID = 'a'
		await expect(uc.link(invalidID,1))
			.rejects.toEqual(Error(`provided user ID '${invalidID}' is not a number`))
		await expect(uc.link(1,invalidID))
			.rejects.toEqual(Error(`provided comment ID '${invalidID}' is not a number`))
	})
	test('missing a parameter', async () => {
		expect.assertions(2)
		const uc = await UserComment.create()
		await expect(uc.link())
			.rejects.toEqual(Error('user ID is undefined'))
		await expect(uc.link(1))
			.rejects.toEqual(Error('comment ID is undefined'))
	})
})

describe('getOwner()', () => {
	test('using valid ID', async () => {
		expect.assertions(1)
		const uc = await UserComment.create()
		const userID = 1, commentID = 2
		await uc.link(userID,commentID)
		const owner = await uc.getOwner(commentID)
		await expect(owner).toEqual(userID)
	})
	test('using invalid ID', async () => {
		expect.assertions(1)
		const uc = await UserComment.create()
		await expect(uc.getOwner(-1))
			.rejects.toEqual(Error('comment IDs start at 1'))
	})
	test('using NaN', async () => {
		expect.assertions(1)
		const uc = await UserComment.create()
		const text = 'a'
		await expect(uc.getOwner(text))
			.rejects.toEqual(Error(`provided comment ID '${text}' is not a number`))
	})
	test('no argument', async () => {
		expect.assertions(1)
		const uc = await UserComment.create()
		await expect(uc.getOwner())
			.rejects.toEqual(Error('comment ID is undefined'))
	})
})

describe('delete()', () => {
	test('valid ID', async () => {
		expect.assertions(1)
		const uc = await UserComment.create()
		await uc.link(1,2)
		const confirm = await uc.delete(2)
		await expect(confirm).toEqual(true)
	})
	test('out of range ID', async () => {
		expect.assertions(1)
		const uc = await UserComment.create()
		await expect(uc.delete(-1))
			.rejects.toEqual(Error('comment IDs start at 1'))
	})
	test('string as ID', async () => {
		expect.assertions(1)
		const uc = await UserComment.create()
		const text = 'a'
		await expect(uc.delete(text))
			.rejects.toEqual(Error(`provided comment ID '${text}' is not a number`))
	})
	test('no argument', async () => {
		expect.assertions(1)
		const uc = await UserComment.create()
		await expect(uc.delete())
			.rejects.toEqual(Error('comment ID is undefined'))
	})
})
