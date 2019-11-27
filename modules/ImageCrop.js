'use strict'
const sharp = require('sharp')
const fs = require('fs')
const height = 255
const width = 255
/**
 * @file Image cropping script
 * @author Joshua Kenyon <kenyonJ@uni.coventry.ac.uk>
 * @version 1.0.1
 */

/**
	 * @description Resizes image to 255,255 while maintaining aspect ratio.
	 * @param {filePath} image - The original image.
	 * @returns {filePath} - Resized image.
	 */
const Crop = async filePath => {
	const file = fs.readFileSync(filePath)
	sharp(file)
	/**
		 * Write output image data to a file.
		 * @param fileOut — The path to write the image data to.
		 * @throws {Error} - Invalid parameters
		 * @returns {promise} — A promise that fulfills with an object containing informations on the resulting file
		 */
		.resize(width, height, {
			fit: 'cover'
		})
		.toFile(filePath)
		.then(console.log)
		.catch(console.error)
}

module.exports = Crop
