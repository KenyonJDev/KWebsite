'use strict'

const Playlists = require('../modules/Playlists')
const UserPlaylist = require('../modules/User_playlists')

const postPlaylists = async(ctx, dbName) => {
	try {
		if (ctx.session.authorised !== true)
			await ctx.redirect('/login?msg=You need to log in')
		const body = ctx.request.body
		console.log(body)
		//creates new instance of class Playlist
		const playlist = await new Playlists(dbName)
		const playlistID = await playlist.create(body.name, body.description)
		//gets id of created playlist
		const userPlaylist = await new UserPlaylist(dbName)
		await userPlaylist.create(ctx.session.id, playlistID)
		//prints id of created playlist
		console.log(playlistID)
		//prints id of user who created the playlist
		console.log(ctx.session.id)
		//await ctx.redirect(`/library/${playlistID}`)
		await ctx.redirect(`/playlists?msg=new playlist "${body.name}" created`)
	} catch (err) {
		console.log(err)
		await ctx.render('playlists', { err: err.message })
	}
}

module.exports = postPlaylists
