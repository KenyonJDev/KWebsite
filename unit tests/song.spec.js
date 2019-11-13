'use strict'

const Song = require('../modules/song')
const mock = require('mock-fs')
const fs = require('fs')

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
		const tags = await song.extractTags('music/song.mp3')
		await expect(tags).toEqual({
			file: 'song.mp3',
			title: 'test title',
			artist: 'test artist',
			year: 2010
		})
		done()
	})

	test('reading a valid mp3 file', async done => {
		expect.assertions(1)
		const song = await new Song()
		const invalidFile = 'files/text.txt'
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
		const invalidPath = 'public/music/invalid_song.mp3'
		await expect(song.extractTags('public/music/invalid_song.mp3'))
			.rejects.toEqual(Error(`file '${invalidPath}' does not exist`))
		done()
	})
})

describe('add', () => {
	test('adding valid tags', async done => {
		expect.assertions(1)
		const song = await new Song()
		const path = 'music/song.mp3'
		const tags = await song.extractTags(path)
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
})

/* describe('get()', () => {

})
 */
