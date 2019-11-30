'use strict'

const Playlists = require('../modules/Playlists')
const UserPlaylist = require('../modules/User_playlists')

const getLibrary = async(ctx, dbName) => {
	const data = []
	const playlists = await new Playlists(dbName)
	const user = await new UserPlaylist(dbName)
	const userplaylists = await user.getUserPlaylists(ctx.session.id)
	const empty = await user.getUserPlaylists(ctx.session.id)
	const list = []
	for (const id of userplaylists) list.push(await playlists.getPlaylist(id))
	if (empty.length === 0) data.empty = true
	console.log(list)
	data.playlists = list
	await ctx.render('library', data)
}

module.exports = getLibrary
