'use strict'

const UserSong = require('../modules/userSong')
const UserPlaylist = require('../modules/User_playlists')
const Song = require('../modules/song')
const Playlists = require('../modules/playlists')

/**
 * Converts song IDs to a list of details.
 * @param {Array<number>} songIDs - A list of comment IDs
 * @param {string} dbName - The database name
 * @returns {Promise<Array<dbData>>} An array of details.
 */
const songIDsToDetails = async(songIDs, dbName) => {
	const song = await new Song(dbName), songs = []
	for (const id of songIDs) {
		const details = await song.get(id.songID)
		songs.push(details)
	}
	return songs
}

/**
 * Converts comment IDs to a list of details.
 * @param {Array<number>} commentIDs - A list of comment IDs
 * @param {ctx} ctx - The context passed from the route
 * @param {string} dbName - The database name
 * @returns {Promise<Array<{number, string}>>} An array of details.
 * @memberof routes
 */
const playlistIDsToDetails = async(playlistIDs, dbName) => {
	const playlist = await new Playlists(dbName), playlists = []
	for (const id of playlistIDs) {
		const details = await playlist.getPlaylist(id)
		playlists.push(details)
	}
	return playlists
}

/**
 * The script that handles the get.playlists route.
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 */
const getPlaylists = async(ctx, dbName) => {
	try {
		if (ctx.session.authorised !== true) await ctx.redirect('/login?msg=you need to login')
		const data = {}
		if (ctx.query.msg) data.msg = ctx.query.msg
		// Making necessary objects
		const userPlaylist = await new UserPlaylist(dbName)
		const userSong = await new UserSong(dbName)
		// Getting song names
		const songIDs = await userSong.get(ctx.session.id)
		const songs = await songIDsToDetails(songIDs, dbName)
		// Getting playlist names
		const playlistIDs = await userPlaylist.getUserPlaylists(ctx.session.id)
		const playlists = await playlistIDsToDetails(playlistIDs, dbName)
		data.songs = songs, data.playlists = playlists
		await ctx.render('playlists', data)
	} catch (err) {
		console.log(err)
		await ctx.render('error', { message: err.message })
	}
}

module.exports = getPlaylists
