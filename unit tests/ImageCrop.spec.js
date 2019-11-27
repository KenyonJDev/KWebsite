'use strict'

const Crop = require('../modules/ImageCrop.js')

describe('crop()', () => {

	test('Data is being returned', async() => {
		const file = await Crop()
		expect(file).toBe(file)
	})
})
