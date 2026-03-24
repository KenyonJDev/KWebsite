'use strict'

const Song = require('../modules/song')
const UserComment = require('../modules/userComment')
const User = require('../modules/user')
const Comment = require('../modules/comment')
const Playlists = require('../modules/Playlists')
const PlaylistSongs = require('../modules/Playlist_songs')
const PlaylistComment = require('../modules/playlistComment')

/**
 * Converts song IDs to a list of details.
 * @param {Array<number>} songIDs - A list of comment IDs
 * @param {string} dbName - The database name
 * @returns {Promise<Array<dbData>>} An array of details.
 * @memberof routes
 */
const songIDsToDetails = async(songIDs, dbName) => {
	const song = await Song.create(dbName), songs = []
	for (const id of songIDs) {
		const details = await song.get(id)
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
const commentIDsToDetails = async(commentIDs, ctx, dbName) => {
	const userComment = await UserComment.create(dbName)
	const comment = await Comment.create(dbName)
	const user = await User.create(dbName)
	const commentList = []
	for (const id of commentIDs) {
		const detail = {}
		const owner = await userComment.getOwner(id)
		detail.id = id
		detail.user = await user.get(owner)
		detail.comment = await comment.get(id)
		if (ctx.session.id === owner) detail.owner = true
		commentList.push(detail)
	}
	return commentList
}

/**
 * The script that handles the get.library/:id route.
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 * @memberof routes
 */
const getLibraryDetails = async(ctx, dbName) => {
	try {
		/* Getting all the necessary objects ready */
		const playlist = await Playlists.create(dbName) // Playlist details
		const playlistsong = await PlaylistSongs.create(dbName) // List of playlist songs
		const playlisComment = await PlaylistComment.create(dbName) // List of playlist comments
		// Retrieving data from the database to display on the page
		const data = await playlist.getPlaylist(ctx.params.id)
		const songs = await playlistsong.getPlaylistSongs(ctx.params.id)
		// Putting song data into a list
		const songsList = await songIDsToDetails(songs, dbName)
		data.songs = songsList
		// Putting ccomments into a list
		const commentIDs = await playlisComment.get(ctx.params.id)
		const commentList = await commentIDsToDetails(commentIDs, ctx, dbName)
		data.comments = commentList
		data.id = ctx.params.id
		if (ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('collection', data)
	} catch (err) {
		console.log(err)
		await ctx.render('error', err.message)
	}
}

module.exports = getLibraryDetails
