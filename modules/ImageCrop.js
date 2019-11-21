'use strict'
const sharp = require('sharp')
const fs = require('fs')
const fn = require('fn')
const height = 255
const width = 255
const File = fs.readFileSync(fn)

sharp(File)
	.resize(width, height, {
		fit: 'cover'
	})
	.toFile(File)
	.then(console.log)
	.catch(console.error)
