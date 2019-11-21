'use strict'
const sharp = require('sharp')
const fs = require('fs')
const fn = require('fn')
const height = 255
const width = 255
const File = fs.readFileSync(fn)
/**
 * @file Image cropping script
 * @author Joshua Kenyon <kenyonJ@uni.coventry.ac.uk>
 * @version 1.0.0
 */

/**
	 * @description Resizes image to 255,255 while maintaining aspect ratio.
	 * @param {File} sharp - The original image.
	 * @returns {File} - Resized image.
	 */
sharp(File)
	.resize(width, height, {
		fit: 'cover'
	})
	.toFile(File)
	.then(console.log)
	.catch(console.error)
