'use strict'

const Song = require('../modules/song')
const Playlist = require('../modules/Playlists')

const start = 0, count = 3

const getHome = async(ctx, dbName) => {
	try {
		const data = {}
		const song = await new Song(dbName)
		const playlist = await new Playlist(dbName)
		const songs = await song.getAll(), playlists = await playlist.getAll()
		let end = songs.length > count ? count : songs.length
		data.songs = await songs.slice(start,end)
		console.log(songs)
		end = playlists.length > count ? count : playlists.length
		data.playlists = await playlists.slice(start,end)
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('index', data)
	} catch(err) {
		console.log(err)
		await ctx.redirect(`/?msg=${err.message}`)
	}
}

module.exports = getHome
