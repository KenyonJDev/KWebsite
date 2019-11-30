'use strict'

const getLogout = async ctx => {
	ctx.session.authorised = null
	ctx.session.id = null
	ctx.redirect('/?msg=you are now logged out')
}

module.exports = getLogout
