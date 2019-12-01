'use strict'

const Song = require('../modules/song')
const UserComment = require('../modules/userComment')
const User = require('../modules/user')
const Comment = require('../modules/comment')
const Playlists = require('../modules/Playlists')
const PlaylistSongs = require('../modules/Playlist_songs')
const PlaylistComment = require('../modules/playlistComment')

const songIDsToDetails = async(songIDs, dbName) => {
	const song = await new Song(dbName), songs = []
	for (const id of songIDs) {
		const details = await song.get(id)
		songs.push(details)
	}
	return songs
}

const commentIDsToDetails = async(commentIDs, ctx, dbName) => {
	const userComment = await new UserComment(dbName)
	const comment = await new Comment(dbName)
	const user = await new User(dbName)
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

const getLibraryDetails = async(ctx, dbName) => {
	try {
		/* Getting all the necessary objects ready */
		const playlist = await new Playlists(dbName) // Playlist details
		const playlistsong = await new PlaylistSongs(dbName) // List of playlist songs
		const playlisComment = await new PlaylistComment(dbName) // List of playlist comments
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
