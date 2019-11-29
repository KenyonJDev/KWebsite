'use strict'

const Comment = require('../modules/comment')

describe('add()', () => {
	test('Adding a valid comment', async done => {
		expect.assertions(1)
		const comment = await new Comment()
		const id = await comment.add('Hello world!')
		await expect(id).toEqual(1)
		done()
	})
	test('Adding an empty comment', async done => {
		expect.assertions(1)
		const comment = await new Comment()
		await expect(comment.add(''))
			.rejects.toEqual(Error('comment cannot be empty'))
		done()
	})
	test('Passing no parameter', async done => {
		expect.assertions(1)
		const comment = await new Comment()
		await expect(comment.add())
			.rejects.toEqual(Error('no comment passed'))
		done()
	})
})

describe('delete()', () => {
	test('deleting a valid comment', async done => {
		expect.assertions(1)
		const comment = await new Comment()
		const id = await comment.add('Hello World!')
		const confirm = await comment.delete(id)
		await expect(confirm).toEqual(true)
		done()
	})
	test('deletinng invalid comment', async done => {
		expect.assertions(1)
		const comment = await new Comment()
		await expect(comment.delete(-1))
			.rejects.toEqual(Error('comment IDs start at 1'))
		done()
	})
	test('passing a non-number', async done => {
		expect.assertions(1)
		const comment = await new Comment()
		await expect(comment.delete('Potato'))
			.rejects.toEqual(Error('comment ID must be a number'))
		done()
	})
	test('passing no parameter', async done => {
		expect.assertions(1)
		const comment = await new Comment()
		await expect(comment.delete())
			.rejects.toEqual(Error('no ID passed'))
		done()
	})
})

describe('get()', () => {
	test('getting a valid comment', async done => {
		expect.assertions(1)
		const comment = await new Comment()
		const text = 'Hello world!'
		const id = await comment.add(text)
		const data = await comment.get(id)
		await expect(data).toEqual(text)
		done()
	})
	test('getting invalid comment', async done => {
		expect.assertions(1)
		const comment = await new Comment()
		await expect(comment.get(0))
			.rejects.toEqual(Error('comment IDs start at 1'))
		done()
	})
	test('passing not a number', async done => {
		expect.assertions(1)
		const comment = await new Comment()
		await expect(comment.get('potato'))
			.rejects.toEqual(Error('comment ID must be a number'))
		done()
	})
	test('passing no ID', async done => {
		expect.assertions(1)
		const comment = await new Comment()
		await expect(comment.get())
			.rejects.toEqual(Error('no comment ID passed'))
		done()
	})
})
