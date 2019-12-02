'use strict'

const PlaylistSongs = require('../modules/Playlist_songs')

/**
 * The script that handles the post.playlistAdd route.
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 * @memberof routes
 */
const postPlaylistAdd = async(ctx, dbName) => {
	try {
		const { song, playlist } = ctx.request.body
		const playlistSong = await new PlaylistSongs(dbName)
		await playlistSong.create(playlist, song)
		await ctx.redirect(`/library/${playlist}?msg=Song added!`)
	} catch (err) {
		console.log(err)
		await ctx.redirect(`/playlists?msg=${err.message}`)
	}
}

module.exports = postPlaylistAdd
