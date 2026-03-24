'use strict'

const UserSong = require('../modules/userSong')
const PlaylistSongs = require('../modules/Playlist_songs')
const Song = require('../modules/song')

/**
 * The script that handes the get.delete-song route.
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 * @memberof routes
 */
const getDeleteSong = async(ctx, dbName) => {
	try {
		const userSong = await UserSong.create(dbName)
		const playlistSong = await PlaylistSongs.create(dbName)
		const user = ctx.session.id
		const owner = await userSong.check(ctx.params.id)
		if (user !== owner) return ctx.redirect('/login?msg=you are not the owner of this file')
		await userSong.remove(ctx.params.id)
		await playlistSong.remove(ctx.params.id)
		const song = await Song.create(dbName)
		await song.delete(ctx.params.id)
		ctx.redirect('/?msg=song deleted!')
	} catch (err) {
		console.log(err)
		await ctx.render('error', err.message)
	}
}

module.exports = getDeleteSong
