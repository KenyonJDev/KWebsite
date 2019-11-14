'use strict'

const Song = require('../modules/song')
const mock = require('mock-fs')
const fs = require('fs')

// Constants used in tests
const validFile = 'music/song.mp3'
const invalidFile = 'files/text.txt'
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

	test('reading valid song', async done => {
		expect.assertions(1)
		const song = await new Song()
		const tags = await song.extractTags(validFile)
		await expect(tags.title).toEqual('test title')
		done()
	})

	test('reading an invalid mp3 file', async done => {
		expect.assertions(1)
		const song = await new Song()
		await expect(song.extractTags(invalidFile))
			.rejects.toEqual(Error(`file '${invalidFile}' is not an .mp3 file`))
		done()
	})

	test('passing no arguments', async done => {
		expect.assertions(1)
		const song = await new Song()
		await expect(song.extractTags())
			.rejects.toEqual(Error('no arguments passed'))
		done()
	})

	test('reading invalid song', async done => {
		expect.assertions(1)
		const song = await new Song()
		await expect(song.extractTags(invalidPath))
			.rejects.toEqual(Error(`file '${invalidPath}' does not exist`))
		done()
	})
})

describe('add', () => {
	test('adding valid tags', async done => {
		expect.assertions(1)
		const song = await new Song()
		const tags = await song.extractTags(validFile)
		const data = await song.add(tags)
		await expect(data.file).toBe('song.mp3')
		done()
	})

	test('passing nothing', async done => {
		expect.assertions(1)
		const song = await new Song()
		await expect(song.add())
			.rejects.toEqual(Error('no tags argument passed'))
		done()
	})

	test('passing empty object', async done => {
		expect.assertions(1)
		const song = await new Song()
		const emptyObj = {}
		await expect(song.add(emptyObj))
			.rejects.toEqual(Error('no filename in tags object'))
		done()
	})

	test('passing object with missing tags', async done => {
		expect.assertions(4)
		const song = await new Song()
		const objects = [
			{tags: {title: 'a', artist: 'b', year: 1}, err: 'filename'}, // missing filename
			{tags: {file: 'a', artist: 'b', year: 1}, err: 'title'}, // missing title
			{tags: {file: 'a', title: 'b', year: 1}, err: 'artist'}, // missing artist
			{tags: {file: 'a', title: 'b', artist: 'c'}, err: 'year'} // missing year
		]
		for(const obj of objects) {
			await expect(song.add(obj.tags))
				.rejects.toEqual(Error(`no ${obj.err} in tags object`))
		}
		done()
	})

	test('passing object with empty tags', async done => {
		expect.assertions(4)
		const song = await new Song()
		const objects = [
			{tags: {file: '', title: 'a', artist: 'b', year: 1}, err: 'filename'}, // empty filename
			{tags: {file: 'a', title: '', artist: 'b', year: 1}, err: 'title'}, // empty title
			{tags: {file: 'a', title: 'b', artist: '', year: 1}, err: 'artist'}, // empty artist
		]
		for(const obj of objects) {
			await expect(song.add(obj.tags))
				.rejects.toEqual(Error(`${obj.err} is empty`))
		}
		const tags = {file: 'a', title: 'b', artist: 'c', year: ''} // empty year
		await expect(song.add(tags))
			.rejects.toEqual(Error('the year in the tags object is not a number'))
		done()
	})
})

describe('get()', () => {
	test('getting valid record', async done => {
		expect.assertions(1)
		const song = await new Song()
		const tags = await song.add(await song.extractTags(validFile))
		const newTags = await song.get(1)
		await expect(newTags).toEqual(tags)
		done()
	})

	test('passing no key', async done => {
		expect.assertions(1)
		const song = await new Song()
		await expect(song.get())
			.rejects.toEqual(Error('key is undefined'))
		done()
	})

	test('passing invalid key', async done => {
		expect.assertions(2)
		const song = await new Song()
		await expect(song.get(0))
			.rejects.toEqual(Error('key must be greater than zero'))
		const invalidKey = 1
		await expect(song.get(invalidKey))
			.rejects.toEqual(Error(`record for key ${invalidKey} does not exist`))
		done()
	})

	test('passing NaN', async done => {
		expect.assertions(1)
		const song = await new Song()
		const key = ''
		await expect(song.get(key))
			.rejects.toEqual(Error(`'${key}' is not a number`))
		done()
	})
})

describe('getAll()', () => {
	test('expecting empty object', async done => {
		expect.assertions(1)
		const song = await new Song()
		const list = await song.getAll()
		await expect(list).toEqual([])
		done()
	})

	test('expecting one object in list', async done => {
		expect.assertions(2)
		const song = await new Song()
		const tags = await song.add(await song.extractTags(validFile))
		const list = await song.getAll()
		await expect(list.length).toEqual(1)
		await expect(list[0]).toEqual(tags)
		done()
	})
})
