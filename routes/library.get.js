'use strict'

const Playlists = require('../modules/Playlists')
const UserPlaylist = require('../modules/User_playlists')

/**
 * The script that handles the get.library route.
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 * @memberof routes
 */
const getLibrary = async(ctx, dbName) => {
	try {
		if (ctx.session.authorised !== true) await ctx.redirect('/login?msg=you need to login')
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
	} catch(err) {
		console.log(err)
		await ctx.render('error', {msg: err.message})
	}
}

module.exports = getLibrary
