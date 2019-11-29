'use strict'

const PlaylistComment = require('../modules/playlistComment')

describe('link()', () => {
	test('passing valid data', async done => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		const confirm = await pc.link(1,2)
		await expect(confirm).toEqual(true)
		done()
	})
	test('out of range parameters', async done => {
		expect.assertions(2)
		const pc = await new PlaylistComment()
		await expect(pc.link(-1,1))
			.rejects.toEqual(Error('playlist IDs start at 1'))
		await expect(pc.link(1,-1))
			.rejects.toEqual(Error('comment IDs start at 1'))
		done()
	})
	test('using strings as parameters', async done => {
		expect.assertions(2)
		const pc = await new PlaylistComment()
		const invalidID = 'a'
		await expect(pc.link(invalidID,1))
			.rejects.toEqual(Error(`provided playlist ID '${invalidID}' is not a number`))
		await expect(pc.link(1,invalidID))
			.rejects.toEqual(Error(`provided comment ID '${invalidID}' is not a number`))
		done()
	})
	test('missing a parameter', async done => {
		expect.assertions(2)
		const pc = await new PlaylistComment()
		await expect(pc.link())
			.rejects.toEqual(Error('playlist ID is undefined'))
		await expect(pc.link(1))
			.rejects.toEqual(Error('comment ID is undefined'))
		done()
	})
})

describe('get()', () => {
	test('getting empty list', async done => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		const list = await pc.get(1)
		await expect(list.length).toEqual(0)
		done()
	})
	test('getting list with one ID', async done => {
		expect.assertions(2)
		const pc = await new PlaylistComment()
		await pc.link(1,2)
		const list = await pc.get(1)
		await expect(list).toHaveLength(1)
		await expect(list[0]).toEqual(2)
		done()
	})
	test('getting list with multiple IDs', async done => {
		expect.assertions(2)
		const pc = await new PlaylistComment()
		await pc.link(1,1)
		let list = await pc.get(1)
		await expect(list).toHaveLength(1)
		await pc.link(1,2)
		list = await pc.get(1)
		await expect(list).toHaveLength(2)
		done()
	})
	test('passing string as arugment', async done => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		const text = 'a'
		await expect(pc.get(text))
			.rejects.toEqual(Error(`provided playlist ID '${text}' is not a number`))
		done()
	})
	test('passing no argument', async done => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		await expect(pc.get())
			.rejects.toEqual(Error('playlist ID is undefined'))
		done()
	})
})

describe('delete()', () => {
	test('valid ID', async done => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		await pc.link(1,2)
		const confirm = await pc.delete(2)
		await expect(confirm).toEqual(true)
		done()
	})
	test('out of range ID', async done => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		await expect(pc.delete(-1))
			.rejects.toEqual(Error('comment IDs start at 1'))
		done()
	})
	test('string as ID', async done => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		const text = 'a'
		await expect(pc.delete(text))
			.rejects.toEqual(Error(`provided comment ID '${text}' is not a number`))
		done()
	})
	test('no argument', async done => {
		expect.assertions(1)
		const pc = await new PlaylistComment()
		await expect(pc.delete())
			.rejects.toEqual(Error('comment ID is undefined'))
		done()
	})
})
