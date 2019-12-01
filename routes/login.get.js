'use strict'

const getLogin = async ctx => {
	if(ctx.session.authorised === true) await ctx.redirect('/?msg=You are already logged in')
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
}

module.exports = getLogin
