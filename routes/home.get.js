'use strict'

const Song = require('../modules/song')
const Playlist = require('../modules/Playlists')

const start = 0, count = 3

/**
 * The script that handles the
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 * @memberof routes
 */
const getHome = async(ctx, dbName) => {
	try {
		const data = {}
		const song = await Song.create(dbName)
		const playlist = await Playlist.create(dbName)
		const songs = await song.getAll(), playlists = await playlist.getAll()
		let end = songs.length > count ? count : songs.length
		data.songs = songs.slice(start,end)
		end = playlists.length > count ? count : playlists.length
		data.playlists = playlists.slice(start,end)
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('index', data)
	} catch(err) {
		console.log(err)
		await ctx.redirect(`/?msg=${err.message}`)
	}
}

module.exports = getHome
