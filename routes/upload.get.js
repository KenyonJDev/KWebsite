'use strict'

const UserPlaylist = require('../modules/User_playlists')
const Playlists = require('../modules/Playlists')

/**
 * The script that handles the get.upload route.
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 * @memberof routes
 */
const getUpload = async(ctx, dbName) => {
	if (ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
	const data = [], lists = []
	if (ctx.query.msg) data.msg = ctx.query.msg
	const userPlaylist = await new UserPlaylist(dbName)
	const playlist = await new Playlists(dbName)
	const playlists = await userPlaylist.getUserPlaylists(ctx.session.id)
	const empty = await userPlaylist.getUserPlaylists(ctx.session.id)
	for (const id of playlists) lists.push(await playlist.getPlaylist(id))
	if (empty.length === 0) data.empty = true
	data.playlists = lists
	await ctx.render('upload', data)
}

module.exports = getUpload
