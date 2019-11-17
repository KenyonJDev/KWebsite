
'use strict'

const Playlist = require('../modules/playlists.js')

describe('Create()', () => {

	test('Create a new playlist', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		const Create = await playlist.Create('Playlist', 'description')
		expect(Create).toBe(true)
		done()
	})

	test('test for blank name', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		await expect( playlist.Create('', 'description') )
			.rejects.toEqual( Error('missing name') )
		done()
	})

	test('test for blank description', async done => {
		expect.assertions(1)
		const playlist = await new Playlist()
		await expect( playlist.Create('Playlist', '') )
			.rejects.toEqual( Error('missing description') )
		done()
	})
})
