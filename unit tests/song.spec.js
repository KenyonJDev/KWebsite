'use strict'

const Song = require('../modules/song.js')
const mock = require('mock-fs')
const fs = require('fs')

// Constants used in tests
const validFile = 'music/song.mp3'
const invalidPath = 'music/invalid.mp3'

beforeAll( () => {
	const songBuffer = fs.readFileSync('unit\ tests/sample.mp3')
	mock({
		'music/': {'song.mp3': songBuffer},
		'files/': {'text.txt': ''}
	})
})

afterAll( () => {
	mock.restore()
})

describe('extractTags()', () => {

	test('reading valid song', async () => {
		expect.assertions(1)
		const song = await Song.create()
		const tags = await song.extractTags(validFile, 'audio/mp3')
		await expect(tags.title).toEqual('test title')
	})

	test('reading an invalid file', async () => {
		expect.assertions(1)
		const song = await Song.create()
		await expect(song.extractTags(invalidPath, 'audio/mp3'))
			.rejects.toEqual(Error(`file '${invalidPath}' does not exist`))
	})

	test('passing no file type', async () => {
		expect.assertions(1)
		const song = await Song.create()
		await expect(song.extractTags(validFile))
			.rejects.toEqual(Error('no file type passed'))
	})

	test('passing incorrect file type', async () => {
		expect.assertions(1)
		const song = await Song.create()
		await expect(song.extractTags(validFile, 'text/txt'))
			.rejects.toEqual(Error('incorrect extension'))
	})

	test('passing no arguments', async () => {
		expect.assertions(1)
		const song = await Song.create()
		await expect(song.extractTags())
			.rejects.toEqual(Error('no arguments passed'))
	})

	test('reading invalid song', async () => {
		expect.assertions(1)
		const song = await Song.create()
		await expect(song.extractTags(invalidPath))
			.rejects.toEqual(Error(`file '${invalidPath}' does not exist`))
	})
})

describe('add', () => {
	test('adding valid tags', async () => {
		expect.assertions(1)
		const song = await Song.create()
		const tags = await song.extractTags(validFile, 'audio/mp3')
		const confirm = await song.add(tags)
		await expect(confirm).toEqual(1)
	})

	test('passing nothing', async () => {
		expect.assertions(1)
		const song = await Song.create()
		await expect(song.add())
			.rejects.toEqual(Error('no tags argument passed'))
	})

	test('passing empty object', async () => {
		expect.assertions(1)
		const song = await Song.create()
		const emptyObj = {}
		await expect(song.add(emptyObj))
			.rejects.toEqual(Error('no title in tags object'))
	})

	test('passing object with missing tags', async () => {
		expect.assertions(3)
		const song = await Song.create()
		const objects = [
			{tags: {artist: 'b', year: 1}, err: 'title'}, // missing title
			{tags: {title: 'b', year: 1}, err: 'artist'}, // missing artist
			{tags: {title: 'b', artist: 'c'}, err: 'year'} // missing year
		]
		for(const obj of objects) {
			await expect(song.add(obj.tags))
				.rejects.toEqual(Error(`no ${obj.err} in tags object`))
		}
	})

	test('passing object with empty tags', async () => {
		expect.assertions(3)
		const song = await Song.create()
		const objects = [
			{tags: {title: '', artist: 'b', year: 1}, err: 'title'}, // empty title
			{tags: {title: 'b', artist: '', year: 1}, err: 'artist'}, // empty artist
		]
		for(const obj of objects) {
			await expect(song.add(obj.tags))
				.rejects.toEqual(Error(`${obj.err} is empty`))
		}
		const tags = {file: 'a', title: 'b', artist: 'c', year: ''} // empty year
		await expect(song.add(tags))
			.rejects.toEqual(Error('the year in the tags object is not a number'))
	})
})

describe('get()', () => {
	test('getting valid record', async () => {
		expect.assertions(1)
		const song = await Song.create()
		const tags = await song.extractTags(validFile, 'audio/mp3')
		await song.add(tags)
		tags.id = 1 // Adding the ID to the tags for comparison.
		const newTags = await song.get(1)
		await expect(newTags.title).toEqual('test title')
	})

	test('passing no key', async () => {
		expect.assertions(1)
		const song = await Song.create()
		await expect(song.get())
			.rejects.toEqual(Error('song ID is undefined'))
	})

	test('passing invalid key', async () => {
		expect.assertions(2)
		const song = await Song.create()
		await expect(song.get(0))
			.rejects.toEqual(Error('song IDs start at 1'))
		const invalidKey = 1
		await expect(song.get(invalidKey))
			.rejects.toEqual(Error(`record for key ${invalidKey} does not exist`))
	})

	test('passing NaN', async () => {
		expect.assertions(1)
		const song = await Song.create()
		const key = ''
		await expect(song.get(key))
			.rejects.toEqual(Error(`provided song ID '${key}' is not a number`))
	})
})

describe('getAll()', () => {
	test('expecting empty object', async () => {
		expect.assertions(1)
		const song = await Song.create()
		const list = await song.getAll()
		await expect(list).toEqual([])
	})

	test('expecting one object in list', async () => {
		expect.assertions(1)
		const song = await Song.create()
		const tags = await song.extractTags(validFile, 'audio/mp3')
		await song.add(tags)
		const list = await song.getAll()
		await expect(list.length).toEqual(1)
	})
})

describe('delete()', () => {
	test('deleting a valid key', async () => {
		expect.assertions(1)
		const song = await Song.create()
		await song.add(await song.extractTags(validFile, 'audio/mp3'))
		const key = 1
		await expect(await song.delete(key)).toEqual(true)
	})

	test('deleting invalid key', async () => {
		expect.assertions(1)
		const song = await Song.create()
		const key = 1
		await expect(song.delete(key))
			.rejects.toEqual(Error(`record for key ${key} does not exist`))
	})

	test('deleting middle key', async () => {
		expect.assertions(4)
		const song = await Song.create()
		for(let i = 0; i < 3; i++) {
			await song.add(await song.extractTags(validFile, 'audio/mp3'))
		}
		const success = await song.delete(2)
		await expect(success).toEqual(true)
		const list = await song.getAll()
		await expect(list.length).toEqual(2)
		await expect(list[1].id).toEqual(3)
		const returnID = await song.add(await song.extractTags(validFile, 'audio/mp3'))
		await expect(returnID).toEqual(4)
	})
})
