'use strict'

const path = require('path')
const fs = require('fs')

/**
 * @fileoverview The checks for song.js.
 * @author Bartlomiej Wlodarski
 */

/**
 * Checks if file path has been passed correctly.
 * @param {string} filePath - The song file path.
 * @memberof Song
 */
const file = async filePath => {
	if(filePath === undefined) throw new Error('no arguments passed')
	if(!fs.existsSync(filePath)) throw new Error(`file '${filePath}' does not exist`)
	if(path.extname(filePath) !== '.mp3') throw new Error(`file '${filePath}' is not an .mp3 file`)
}

/**
 * Checks if passed tags are formatted correctly.
 * @async
 * @param {Tags} tags - The song's ID3 tags.
 * @memberof Song
 */
const tags = async tags => {
	if(tags === undefined) throw new Error('no tags argument passed')
	await checkFile(tags.file)
	await checkTitle(tags.title)
	await checkArtist(tags.artist)
	await checkYear(tags.year)
}

/**
 * Checks the filename.
 * @param {*} file - The filename to check.
 * @memberof Song
 */
const checkFile = async file => {
	if(file === undefined) throw new Error('no filename in tags object')
	if(file === '') throw new Error('filename is empty')
}

/**
 * Checks the title.
 * @param {string} title - Title to check.
 * @memberof Song
 */
const checkTitle = async title => {
	if(title === undefined) throw new Error('no title in tags object')
	if(title === '') throw new Error('title is empty')
}

/**
 * Checks the arist.
 * @param {string} artist - Artist to check.
 * @memberof Song
 */
const checkArtist = async artist => {
	if(artist === undefined) throw new Error('no artist in tags object')
	if(artist === '') throw new Error('artist is empty')
}

/**
 * Checks the year.
 * @param {number} year - Year to check.
 * @memberof Song
 */
const checkYear = async year => {
	if(year === undefined) throw new Error('no year in tags object')
	year = parseInt(year)
	if(isNaN(year)) throw new Error('the year in the tags object is not a number')
}

/**
 * Checks the song key.
 * @async
 * @param {number} key - ID of the song record in the database.
 * @memberof Song
 */
const key = async key => {
	if(key === undefined) throw new Error('key is undefined')
	const id = parseInt(key)
	if(isNaN(id)) throw new Error(`'${key}' is not a number`)
	if(key < 1) throw new Error('key must be greater than zero')
}

module.exports = {file, tags, key}
