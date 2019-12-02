'use strict'

const Song = require('../modules/song')

/**
 * The script that handles the get.songs route.
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 * @memberof routes
 */
const getSongs = async(ctx, dbName) => {
	const song = await new Song(dbName)
	const data = await song.getAll()
	await ctx.render('songs', {songs: data})
}

module.exports = getSongs
