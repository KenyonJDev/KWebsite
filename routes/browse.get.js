'use strict'

const Playlists = require('../modules/Playlists')

const getBrowse = async(ctx, dbName) => {
	const data = []
	if (ctx.query.msg) data.msg = ctx.query.msg
	const playlists = await new Playlists(dbName)
	const all = await playlists.getAll()
	data.playlists = all
	await ctx.render('browse', data)
}

module.exports = getBrowse
