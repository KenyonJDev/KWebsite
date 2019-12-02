'use strict'

const UserComment = require('../modules/userComment')
const Comment = require('../modules/comment')
const PlaylistComment = require('../modules/playlistComment')

/**
 * The script that handles the get.delete-com route.
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 * @memberof routes
 */
const getDeleteComment = async(ctx, dbName) => {
	try {
		const userComment = await new UserComment(dbName)
		const comment = await new Comment(dbName)
		const playlistComment = await new PlaylistComment(dbName)
		await playlistComment.delete(ctx.params.id)
		await userComment.delete(ctx.params.id)
		await comment.delete(ctx.params.id)
		await ctx.redirect('back') // Takes you back to the previous page
	} catch (err) {
		console.log(err)
		await ctx.redirect('error', err.message)
	}
}

module.exports = getDeleteComment
