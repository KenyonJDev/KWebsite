'use strict'

const Playlists = require('../modules/Playlists')

/**
 * The script that handles the get.browse route.
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 * @memberof routes
 */
const getBrowse = async(ctx, dbName) => {
	const data = []
	if (ctx.query.msg) data.msg = ctx.query.msg
	const playlists = await new Playlists(dbName)
	const all = await playlists.getAll()
	data.playlists = all
	await ctx.render('browse', data)
}

module.exports = getBrowse
