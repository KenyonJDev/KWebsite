'use strict'

/**
 * The script that handles the get.login route.
 * @param {ctx} ctx - Context from route
 * @memberof routes
 */
const getLogin = async ctx => {
	if(ctx.session.authorised === true) await ctx.redirect('/?msg=You are already logged in')
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
}

module.exports = getLogin
