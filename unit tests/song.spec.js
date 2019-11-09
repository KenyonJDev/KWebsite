'use strict'

const Song = require('../modules/song')
const mock = require('mock-fs')
const ID3 = require('node-id3')

beforeAll( () => {
	mock({
		'public': {
			'music': {
				'song.mp3': ''
			}
		}
	})
	const tags = {
		title: 'Hyori Ittai',
		artist: 'Yuzu',
		album: 'Shinsekai'
	}
	const success = ID3.update(tags, 'public/music/song.mp3')
	if(!success) throw new Error('tag insertion not successful')
	console.log(ID3.read('public/music/song.mp3'))
})

afterAll( () => {
	mock.restore()
})

describe('add()', () => {
	test('reading song', async done => {
		expect.assertions(1)
		try {
			const song = await new Song()
			const tags = await song.add('song.mp3')
			expect(tags).not(undefined)
		} catch(err) {
			done.fail('no data returned')
		} finally {
			done()
		}
	})
})
