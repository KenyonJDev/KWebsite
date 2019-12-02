'use strict'

const User = require('../modules/user')

/**
 * The script that handles the post.login route.
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 * @memberof routes
 */
const postLogin = async(ctx, dbName) => {
	try {
		if(ctx.session.authorised === true) ctx.redirect('/?msg=You are already logged in')
		const body = ctx.request.body
		const user = await new User(dbName)
		const id = await user.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.id = id
		return await ctx.redirect('/?msg=you are now logged in...')
	} catch(err) {
		await ctx.redirect(`/login?msg=${err.message}`)
	}
}

module.exports = postLogin
