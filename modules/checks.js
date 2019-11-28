'use strict'

const fs = require('fs')

/**
 * @fileoverview The file where argument checks reside.
 * @author Bartlomiej Wlodarski
 */

/**
 * Checks if file path has been passed correctly.
 * @async
 * @param {string} filePath - The song file path.
 * @memberof Checks
 */
const file = async filePath => {
	if(filePath === undefined) throw new Error('no arguments passed')
	if(!fs.existsSync(filePath)) throw new Error(`file '${filePath}' does not exist`)
}

/**
 * Checks if the file type is correct.
 * @async
 * @param {string} fileType - The file type string.
 * @memberof Checks
 */
const type = async fileType => {
	if(fileType === undefined) throw new Error('no file type passed')
	if(fileType !== 'audio/mp3') throw new Error('incorrect extension')
}

/**
 * Checks if the user ID is correct.
 * @async
 * @param {number} userID - The user ID.
 * @memberof Checks
 */
const user = async userID => {
	if(userID === undefined) throw new Error('user ID is undefined')
	const id = await parseInt(userID)
	if(isNaN(id)) throw new Error(`provided user ID '${userID}' is not a number`)
	if(id < 1) throw new Error('user IDs start at 1')
}

/**
 * Checks the song ID.
 * @async
 * @param {number} songID - The song ID.
 * @memberof Checks
 */
const song = async songID => {
	if(songID === undefined) throw new Error('song ID is undefined')
	const id = await parseInt(songID)
	if(isNaN(id)) throw new Error(`provided song ID '${songID}' is not a number`)
	if(id < 1) throw new Error('song IDs start at 1')
}

/**
 * Checks the song ID.
 * @async
 * @param {number} commentID - The song ID.
 * @memberof Checks
 */
const comment = async commentID => {
	if(commentID === undefined) throw new Error('comment ID is undefined')
	const id = await parseInt(commentID)
	if(isNaN(id)) throw new Error(`provided comment ID '${commentID}' is not a number`)
	if(id < 1) throw new Error('comment IDs start at 1')
}

/**
 * Checks the playlist ID.
 * @async
 * @param {number} playlistID - The playlist ID.
 * @memberof Checks
 */
const playlist = async playlistID => {
	if(playlistID === undefined) throw new Error('playlist ID is undefined')
	const id = await parseInt(playlistID)
	if(isNaN(id)) throw new Error(`provided playlist ID '${playlistID}' is not a number`)
	if(id < 1) throw new Error('playlist IDs start at 1')
}

/**
 * Checks if passed tags are formatted correctly.
 * @async
 * @param {Tags} tags - The song's ID3 tags.
 * @memberof Checks
 */
const tags = async tags => {
	if(tags === undefined) throw new Error('no tags argument passed')
	await checkTitle(tags.title)
	await checkArtist(tags.artist)
	await checkYear(tags.year)
}

/* ---------- Internal functions ---------- */

/**
 * Checks the title.
 * @param {string} title - Title to check.
 * @ignore
 */
const checkTitle = async title => {
	if(title === undefined) throw new Error('no title in tags object')
	if(title === '') throw new Error('title is empty')
}

/**
 * Checks the arist.
 * @param {string} artist - Artist to check.
 * @ignore
 */
const checkArtist = async artist => {
	if(artist === undefined) throw new Error('no artist in tags object')
	if(artist === '') throw new Error('artist is empty')
}

/**
 * Checks the year.
 * @param {number} year - Year to check.
 * @ignore
 */
const checkYear = async year => {
	if(year === undefined) throw new Error('no year in tags object')
	year = await parseInt(year)
	if(isNaN(year)) throw new Error('the year in the tags object is not a number')
}


module.exports = {file, type, tags, comment, playlist, song, user}
