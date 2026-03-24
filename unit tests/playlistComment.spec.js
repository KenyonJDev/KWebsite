'use strict'

const PlaylistComment = require('../modules/playlistComment')

describe('link()', () => {
	test('passing valid data', async () => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		const confirm = await pc.link(1,2)
		await expect(confirm).toEqual(true)
	})
	test('out of range parameters', async () => {
		expect.assertions(2)
		const pc = await new PlaylistComment()
		await expect(pc.link(-1,1))
			.rejects.toEqual(Error('playlist IDs start at 1'))
		await expect(pc.link(1,-1))
			.rejects.toEqual(Error('comment IDs start at 1'))
	})
	test('using strings as parameters', async () => {
		expect.assertions(2)
		const pc = await new PlaylistComment()
		const invalidID = 'a'
		await expect(pc.link(invalidID,1))
			.rejects.toEqual(Error(`provided playlist ID '${invalidID}' is not a number`))
		await expect(pc.link(1,invalidID))
			.rejects.toEqual(Error(`provided comment ID '${invalidID}' is not a number`))
	})
	test('missing a parameter', async () => {
		expect.assertions(2)
		const pc = await new PlaylistComment()
		await expect(pc.link())
			.rejects.toEqual(Error('playlist ID is undefined'))
		await expect(pc.link(1))
			.rejects.toEqual(Error('comment ID is undefined'))
	})
})

describe('get()', () => {
	test('getting empty list', async () => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		const list = await pc.get(1)
		await expect(list.length).toEqual(0)
	})
	test('getting list with one ID', async () => {
		expect.assertions(2)
		const pc = await new PlaylistComment()
		await pc.link(1,2)
		const list = await pc.get(1)
		await expect(list).toHaveLength(1)
		await expect(list[0]).toEqual(2)
	})
	test('getting list with multiple IDs', async () => {
		expect.assertions(2)
		const pc = await new PlaylistComment()
		await pc.link(1,1)
		let list = await pc.get(1)
		await expect(list).toHaveLength(1)
		await pc.link(1,2)
		list = await pc.get(1)
		await expect(list).toHaveLength(2)
	})
	test('passing string as arugment', async () => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		const text = 'a'
		await expect(pc.get(text))
			.rejects.toEqual(Error(`provided playlist ID '${text}' is not a number`))
	})
	test('passing no argument', async () => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		await expect(pc.get())
			.rejects.toEqual(Error('playlist ID is undefined'))
	})
})

describe('delete()', () => {
	test('valid ID', async () => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		await pc.link(1,2)
		const confirm = await pc.delete(2)
		await expect(confirm).toEqual(true)
	})
	test('out of range ID', async () => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		await expect(pc.delete(-1))
			.rejects.toEqual(Error('comment IDs start at 1'))
	})
	test('string as ID', async () => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		const text = 'a'
		await expect(pc.delete(text))
			.rejects.toEqual(Error(`provided comment ID '${text}' is not a number`))
	})
	test('no argument', async () => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		await expect(pc.delete())
			.rejects.toEqual(Error('comment ID is undefined'))
	})
})
