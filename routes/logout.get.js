'use strict'

/**
 * The script that handles the get.logout route.
 * @param {ctx} ctx - Context from route
 * @memberof routes
 */
const getLogout = async ctx => {
	ctx.session.authorised = null
	ctx.session.id = null
	ctx.redirect('/?msg=you are now logged out')
}

module.exports = getLogout
