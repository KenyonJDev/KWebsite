'use strict'

const Comment = require('../modules/comment')
const UserComment = require('../modules/userComment')
const PlaylistComment = require('../modules/playlistComment')

/**
 * The script that handles the post.comment route.
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 * @memberof routes
 */
const postComment = async(ctx, dbName) => {
	try {
		if (!ctx.session.authorised) await ctx.redirect('/login?msg=You need to log in')
		const body = ctx.request.body, id = body.id
		const playlistID = body.id, userID = ctx.session.id
		const comment = await Comment.create(dbName)
		const userComment = await UserComment.create(dbName)
		const playlistComment = await PlaylistComment.create(dbName)
		const commentID = await comment.add(body.comment)
		await userComment.link(userID, commentID)
		await playlistComment.link(playlistID, commentID)
		await ctx.redirect(`/library/${id}`)
	} catch (err) {
		console.log(err)
		await ctx.render('error', err.message)
	}
}

module.exports = postComment
