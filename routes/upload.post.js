'use strict'

const fs = require('fs')
const UserSong = require('../modules/userSong')
const PlaylistSongs = require('../modules/Playlist_songs')
const Song = require('../modules/song')
const sharp = require('sharp')

const size = 1024

const postUpload = async(ctx, dbName, dirname) => {
	try {
		if (!ctx.session.authorised) await ctx.redirect('/login?msg=You need to log in')
		const body = ctx.request.body, song = await new Song(dbName)
		const { path: songPath, type: songType } = ctx.request.files.song
		const { path: artPath } = ctx.request.files.albumArt
		const id = await song.add(await song.extractTags(songPath, songType))
		await fs.copyFileSync(songPath, `public/music/${id}.mp3`)
		await sharp(artPath).resize(size, size).toFile(`${dirname}\\public\\art\\${id}`)
		const userSong = await new UserSong(dbName)
		const playlistSong = await new PlaylistSongs(dbName)
		await userSong.link(ctx.session.id, id)
		await playlistSong.create(body.Playlists, id)
		await ctx.redirect(`/songs/${id}`)
	} catch (err) {
		console.log(err)
		await ctx.redirect(`upload?msg=${err.message}`)
	}
}

module.exports = postUpload
