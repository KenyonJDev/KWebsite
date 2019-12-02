'use strict'

const User = require('../modules/user')

/**
 * The script that handles the get.register route.
 * @param {ctx} ctx - Context from route
 * @param {string} dbName - Database name
 * @memberof routes
 */
const postRegister = async(ctx, dbName) => {
	try {
		const body = ctx.request.body
		console.log(`[register] body: ${body.user}`)
		const user = await new User(dbName)
		await user.register(body.user, body.pass)
		await ctx.redirect('login?msg=You are now registered!')
	} catch(err) {
		await ctx.render('register', {msg: err.message})
	}
}

module.exports = postRegister
