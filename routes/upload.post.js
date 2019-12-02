'use strict'

const fs = require('fs')
const UserSong = require('../modules/userSong')
const PlaylistSongs = require('../modules/Playlist_songs')
const Song = require('../modules/song')

const postUpload = async(ctx, dbName) => {
	try {
		if (!ctx.session.authorised) await ctx.redirect('/login?msg=You need to log in')
		const body = ctx.request.body
		const song = await new Song(dbName)
		const { path, type } = ctx.request.files.song
		const id = await song.add(await song.extractTags(path, type))
		await fs.copyFileSync(path, `public/music/${id}.mp3`)
		const userSong = await new UserSong(dbName)
		const playlistSong = await new PlaylistSongs(dbName)
		await userSong.link(ctx.session.id, id)
		await playlistSong.create(body.Playlists, id)
		await ctx.redirect(`/songs/${id}`)
	} catch (err) {
		console.log(err)
		await ctx.render('upload', { msg: err.message })
	}
}

module.exports = postUpload
