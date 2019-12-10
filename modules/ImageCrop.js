'use strict'
const sharp = require('sharp')
const fs = require('fs')
const check = require('./checks')
const mime = require('mime-types')

const size = 1024

/**
 * @file Asynchronous image cropping script
 * @author Joshua Kenyon <kenyonJ@uni.coventry.ac.uk>
 * @version 1.0.3
 */

/**
 * Resizes image to 1024x1024 while maintaining aspect ratio.
 * @param {filePath} image - The original image path.
 * @returns {Promise<true>} - Confirmation of resize
 */
const crop = async(filePath, fileType) => {
	await check.file(filePath)
	const type = mime.extension(fileType)
	if(!(type in ['png','jpg','gif','svg']))
		throw new Error('Unsupported file type')
	const file = fs.readFileSync(filePath)
	await sharp(file)
		.resize(size, size)
		.toFile(filePath)
	return true
}

module.exports = crop
