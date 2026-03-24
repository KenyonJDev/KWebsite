'use strict'

const Comment = require('../modules/comment')

describe('add()', () => {
	test('Adding a valid comment', async () => {
		expect.assertions(1)
		const comment = await Comment.create()
		const id = await comment.add('Hello world!')
		await expect(id).toEqual(1)
	})
	test('Adding an empty comment', async () => {
		expect.assertions(1)
		const comment = await Comment.create()
		await expect(comment.add(''))
			.rejects.toEqual(Error('comment cannot be empty'))
	})
	test('Passing no parameter', async () => {
		expect.assertions(1)
		const comment = await Comment.create()
		await expect(comment.add())
			.rejects.toEqual(Error('no comment passed'))
	})
})

describe('delete()', () => {
	test('deleting a valid comment', async () => {
		expect.assertions(1)
		const comment = await Comment.create()
		const id = await comment.add('Hello World!')
		const confirm = await comment.delete(id)
		await expect(confirm).toEqual(true)
	})
	test('deletinng invalid comment', async () => {
		expect.assertions(1)
		const comment = await Comment.create()
		await expect(comment.delete(-1))
			.rejects.toEqual(Error('comment IDs start at 1'))
	})
	test('passing a non-number', async () => {
		expect.assertions(1)
		const comment = await Comment.create()
		await expect(comment.delete('Potato'))
			.rejects.toEqual(Error('comment ID must be a number'))
	})
	test('passing no parameter', async () => {
		expect.assertions(1)
		const comment = await Comment.create()
		await expect(comment.delete())
			.rejects.toEqual(Error('no ID passed'))
	})
})

describe('get()', () => {
	test('getting a valid comment', async () => {
		expect.assertions(1)
		const comment = await Comment.create()
		const text = 'Hello world!'
		const id = await comment.add(text)
		const data = await comment.get(id)
		await expect(data).toEqual(text)
	})
	test('getting invalid comment', async () => {
		expect.assertions(1)
		const comment = await Comment.create()
		await expect(comment.get(0))
			.rejects.toEqual(Error('comment IDs start at 1'))
	})
	test('passing not a number', async () => {
		expect.assertions(1)
		const comment = await Comment.create()
		await expect(comment.get('potato'))
			.rejects.toEqual(Error('comment ID must be a number'))
	})
	test('passing no ID', async () => {
		expect.assertions(1)
		const comment = await Comment.create()
		await expect(comment.get())
			.rejects.toEqual(Error('no comment ID passed'))
	})
})
