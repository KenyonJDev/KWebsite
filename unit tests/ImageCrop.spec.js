'use strict'

//const crop = require('../modules/ImageCrop')
const mock = require('mock-fs')
const fs = require('fs')

beforeAll( () => {
	const imageBuffer = fs.readFileSync()
	mock({'image.png': imageBuffer})
})

//test('passing all valid arguments', async done => {
//	expect.assertions(1)
//	await
//})
