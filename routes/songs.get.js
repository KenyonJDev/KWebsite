'use strict'

const Song = require('../modules/song')

const getSongs = async(ctx, dbName) => {
	const song = await new Song(dbName)
	const data = await song.getAll()
	await ctx.render('songs', {songs: data})
}

module.exports = getSongs
