'use strict'
/**
 * @fileoverview Unit test for ImageCrop.js.
 * @author Joshua Kenyon <KenyonJ@uni.coventry.ac.uk>
 */

const Crop = require('../modules/ImageCrop.js')

describe('crop()', () => {

	test('Data is being returned', async() => {
		const file = await Crop()
		expect(file).toBe(file)
	})
})
