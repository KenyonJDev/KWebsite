#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')
const fs = require('fs-extra')
const mime = require('mime-types')
//const jimp = require('jimp')

/* IMPORT CUSTOM MODULES */
const User = require('./modules/user')
const Song = require('./modules/song')
const Playlists = require('./modules/playlists')
const User_Playlists = require('./modules/User_playlists')
let user_id = ''


const app = new Koa()
const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'website.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/', async ctx => await ctx.render('homepage'))
	/*try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('index')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})*/

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		console.log(body)
		// call the functions in the module
		const user = await new User(dbName)
		await user.register(body.user, body.pass)
		// await user.uploadPicture(path, type)
		// redirect to the home page
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.login(body.user, body.pass)
		let id = await user.getuserID(body.user)
		user_id = id
		console.log(id)
		ctx.session.authorised = true
		return ctx.redirect('/?msg=you are now logged in...')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/songs', async ctx => {
	const song = await new Song(dbName)
	const data = await song.getAll()
	await ctx.render('songs', {songs: data})
})

router.get('/playlists', async ctx => {
	try {
		if(ctx.session.authorised === null) await ctx.redirect('/login?msg=you need to login')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('playlists')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})
/**
 * The script to process new playlist creations.
 *
 * @name Playlist Script
 * @route {POST} /playlists
 */
router.post('/playlists', koaBody, async ctx => {
	try{
		const body = ctx.request.body
		console.log(body)
		//creates new instance of class Playlist
		const playlist = await new Playlists(dbName)
		await playlist.create(body.name, body.description)
		//gets id of created playlist
		let playlist_id = await playlist.getplaylistID(body.name)
		//prints id of created playlist
		console.log(playlist_id)
		//prints id of user who created the playlist
		console.log(user_id)
		ctx.redirect(`/playlists?msg=new playlist "${body.name}" created`)
	}catch(err) {
		await ctx.render('error', {message: err})
	}
})

/*router.post('/upload', koaBody, async ctx => {
	try {
		const song = await new Song(dbName)
		const {path, type} = ctx.request.files.song
		if(type !== 'audio/mp3') throw new Error('incorrect extension')
		const newPath = `${path}.mp3`
		await fs.renameSync(path, newPath)
		const id = await song.add(await song.extractTags(newPath))
		await fs.copySync(newPath, `public/music/${id}.mp3`)
		await ctx.redirect(`/song/${id}`)
	} catch(err) {
		console.log(err)
		await ctx.render('upload', {msg: err.message})
	}
})*/

router.get('/browse', async ctx => await ctx.render('browse'))

router.get('/upload', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	await ctx.render('upload', data)
})

router.post('/upload', koaBody, async ctx => {
	try {
		const song = await new Song(dbName)
		const {path, type} = ctx.request.files.song
		if(type !== 'audio/mp3') throw new Error('incorrect extension')
		const newPath = `${path}.mp3`
		await fs.renameSync(path, newPath)
		const id = await song.add(await song.extractTags(newPath))
		await fs.copySync(newPath, `public/music/${id}.mp3`)
		await ctx.redirect(`/song/${id}`)
	} catch(err) {
		console.log(err)
		await ctx.render('upload', {msg: err.message})
	}
})

router.get('/song/:id', async ctx => {
	try {
		const song = await new Song(dbName)
		const data = await song.get(ctx.params.id)
		await ctx.render('play', data)
	} catch(err) {
		await ctx.render('error', err.message)
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
