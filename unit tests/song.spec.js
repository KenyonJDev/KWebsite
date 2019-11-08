'use strict'

const Song = require('../modules/song')
const mock = require('mock-fs')
const ID3 = require('node-id3')

beforeAll( async() => {
    mock({
        'public/music': {
            'song.mp3': ''
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

afterAll( async() => {
    mock.restore()
})

describe('add()', async() => {

    beforeEach( async() => {
        const song = await new Song() 
    })
    
    test('reading song', async done => {
        expect.assertions(1)
        await song.add('song.mp3')
    })
})