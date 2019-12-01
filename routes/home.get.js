'use strict'

const getHome = async ctx => {
	try {
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('index', data)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
}

module.exports = getHome
