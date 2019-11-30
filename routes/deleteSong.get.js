'use strict'

const UserSong = require('../modules/userSong')
const PlaylistSongs = require('../modules/Playlist_songs')
const Song = require('../modules/song')

const getDeleteSong = async(ctx, dbName) => {
	try {
		const userSong = await new UserSong(dbName)
		const playlistSong = await new PlaylistSongs(dbName)
		const user = ctx.session.id
		const owner = await userSong.check(ctx.params.id)
		if (user !== owner) return ctx.redirect('/login?msg=you are not the owner of this file')
		await userSong.remove(ctx.params.id)
		await playlistSong.remove(ctx.params.id)
		const song = await new Song(dbName)
		await song.delete(ctx.params.id)
		ctx.redirect('/?msg=song deleted!')
	} catch (err) {
		console.log(err)
		await ctx.render('error', err.message)
	}
}

module.exports = getDeleteSong
