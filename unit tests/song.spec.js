'use strict'

const Song = require('../modules/song')
const mock = require('mock-fs')
const fs = require('fs')

beforeAll( () => {
	const songBuffer = fs.readFileSync('public/music/song.mp3')
	mock({'public/music/song.mp3': songBuffer})
})

afterAll( () => {
	mock.restore()
})

describe('add()', () => {

	test('reading valid song', async done => {
		expect.assertions(1)
		const song = await new Song()
		const data = await song.add('public/music/song.mp3')
		await expect(data.common.album).toBe('test album title')
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
