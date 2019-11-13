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

describe('add()', () => {

	test('reading valid song', async done => {
		expect.assertions(1)
		const song = await new Song()
		const tags = await song.add('music/song.mp3')
		await expect(tags).toEqual({
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
		await expect(song.add(invalidFile))
			.rejects.toEqual(Error(`file '${invalidFile}' is not an .mp3 file`))
		done()
	})

	test('reading invalid song', async done => {
		expect.assertions(1)
		const song = await new Song()
		const invalidPath = 'public/music/invalid_song.mp3'
		await expect(song.add('public/music/invalid_song.mp3'))
			.rejects.toEqual(Error(`file '${invalidPath}' does not exist`))
		done()
	})
})

describe('get()', () => {
	test('retrieving a valid song', async done => {
		expect.assertions(1)
		const song = await new Song()
		const path = 'music/song.mp3'
		await song.add(path)
		const data = await song.get(1)
		await expect(data.file).toBe('song.mp3')
		done()
	})
	test('retrieving invalid key', async done => {
		expect.assertions(1)
		const song = await new Song()
		const path = 'music/song.mp3'
		await song.add(path)
		const key = 2
		await expect(song.get(key))
			.rejects.toEqual(Error(`record for key ${key} does not exist`))
		done()
	})
})
