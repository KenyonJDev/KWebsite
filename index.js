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

/* IMPORT CUSTOM MODULES */
const User = require('./modules/user')
const Song = require('./modules/song')
const UserSong = require('./modules/userSong')
const Playlists = require('./modules/playlists')
const UserPlaylist = require('./modules/User_playlists')
const PlaylistSongs = require('./modules/Playlist_songs')


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
router.get('/', async ctx => {
	try {
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('homepage')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

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
		const body = ctx.request.body
		console.log(`[register] body: ${body.user}`)
		const user = await new User(dbName)
		await user.register(body.user, body.pass)
		ctx.redirect(`/?msg=new user "${body.user}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The secure login page.
 *
 * @name Login Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})

/**
 * The script to process login.
 *
 * @name Login Script
 * @route {POST} /register
 */
router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		const id = await user.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.id = id
		return await ctx.redirect('/?msg=you are now logged in...')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The songs page.
 *
 * @name Songs Page
 * @route {Get} /songs
 */
router.get('/songs', async ctx => {
	const song = await new Song(dbName)
	const data = await song.getAll()
	await ctx.render('songs', {songs: data})
})

/**
 * The individual song page.
 *
 * @name Songs/id Page
 * @route {Get} /songs
 */
router.get('/songs/:id', async ctx => {
	try {
		const song = await new Song(dbName)
		const data = await song.get(ctx.params.id)
		const userSong = await new UserSong(dbName)
		const owner = await userSong.check(ctx.params.id)
		console.log(`[songs][${ctx.params.id}] owner: ${owner}`)
		if(owner === ctx.session.id) data.owner = true
		await ctx.render('play', data)
	} catch(err) {
		console.log(err)
		await ctx.render('error', err.message)
	}
})

/**
 * The playlist creation page.
 *
 * @name Playlists Page
 * @route {Get} /playlists
 */
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
		const playlistID = await playlist.create(body.name, body.description)
		//gets id of created playlist
		const userPlaylist = await new UserPlaylist(dbName)
		await userPlaylist.create(ctx.session.id, playlistID)
		//prints id of created playlist
		console.log(playlistID)
		//prints id of user who created the playlist
		console.log(ctx.session.id)
		await ctx.redirect(`/library/${playlistID}`)
		//ctx.redirect(`/playlists?msg=new playlist "${body.name}" created`)
	}catch(err) {
		console.log(err)
		await ctx.render('error', {message: err})
	}
})
//display all playlists in db: done
//add route to display user playlists: done
//add function that retrieves certain playlist details (name, desc): not necessary but done
//change routes so that you go to library 1st, then if its empty you create playlists from there
//add function that allows to insert existing songs into different playlists: dont think ill have time
//add documentation

/**
 * The user playlists page AKA Library.
 *
 * @name Library Page
 * @route {Get} /library
 */
router.get('/library', async ctx => {
	const data = []
	const playlists = await new Playlists(dbName)
	const user = await new UserPlaylist(dbName)
	const userplaylists = await user.getUserPlaylists(ctx.session.id)
	const empty = await user.getUserPlaylists(ctx.session.id)
	const list = []
	for(const id of userplaylists) list.push(await playlists.getPlaylist(id))
	//for(const pl in list) names.push(await playlists.getPlaylistDetails(list.id))
	//console.log(names)
	//data.playlists = list
	if(empty.length === 0) data.empty = true
	console.log(list)
	data.playlists = list
	//for(const id of playlists) lists.push(await playlist.getPlaylist(id))
	//console.log(userplaylists)
	await ctx.render('library', data)
})

/**
 * The individual playlist page.
 *
 * @name Library/id Page
 * @route {Get} /library
 */
router.get('/library/:id', async ctx => {
	try {
		const playlist = await new Playlists(dbName)
		const song = await new Song(dbName)
		const playlistsong = await new PlaylistSongs(dbName)
		const userPlaylist = await new UserPlaylist(dbName)
		const data = await playlist.getPlaylist(ctx.params.id)
		const owner = await userPlaylist.check(ctx.params.id)
		const songs = await playlistsong.getPlaylistSongs(ctx.params.id)
		console.log(songs)
		const list = []
		for(const id of songs) list.push(await song.get(id))
		//console.log(list)
		//console.log(`[playlists][${ctx.params.id}] owner: ${owner}`)
		if(owner === ctx.session.id) data.owner = true
		data.songs = list
		await ctx.render('collection', data)
	} catch(err) {
		console.log(err)
		await ctx.render('error', err.message)
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

/**
 * The page that displays all the playlists in the database.
 *
 * @name Browse Page
 * @route {Get} /browse
 */
router.get('/browse', async ctx => {
	if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
	const data = []
	if(ctx.query.msg) data.msg = ctx.query.msg
	const playlists = await new Playlists(dbName)
	const all = await playlists.getAll()
	console.log(all)
	data.playlists = all
	await ctx.render('browse', data)
})

/**
 * The page responsible for uploading songs.
 *
 * @name Upload Page
 * @route {GET} /upload
 */
router.get('/upload', async ctx => {
	if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
	const data = []
	if(ctx.query.msg) data.msg = ctx.query.msg
	//console.log(body.playlists)
	const userPlaylist = await new UserPlaylist(dbName)
	const playlist = await new Playlists(dbName)
	const playlists = await userPlaylist.getUserPlaylists(ctx.session.id)
	const empty = await userPlaylist.getUserPlaylists(ctx.session.id)
	const lists = []
	console.log(playlists)
	for(const id of playlists) lists.push(await playlist.getPlaylist(id))
	//console.log(data)
	if(empty.length === 0) data.empty = true
	data.playlists = lists
	//data.playlists = lists
	console.log(lists)
	//console.log({userPlaylist: playlists})
	await ctx.render('upload', data)
})

/**
 * The script to process song uploads.
 *
 * @name Upload Script
 * @route {POST} /upload
 */
// eslint-disable-next-line max-lines-per-function
router.post('/upload', koaBody, async ctx => {
	try {
		const body = ctx.request.body
		const song = await new Song(dbName)
		const {path, type} = ctx.request.files.song
		if(body.Playlists === '0') {
			return await ctx.redirect('/upload?msg=You need to select a playlistlist')
		} else {
			const id = await song.add(await song.extractTags(path, type))
			console.log(`[upload] id: ${id}`)
			await fs.copySync(path, `public/music/${id}.mp3`)
			const userSong = await new UserSong(dbName)
			const playlistSong = await new PlaylistSongs(dbName)
			console.log(`[upload] ctx.session.id: ${ctx.session.id}`)
			//prints id of selected playlist, can be removed before submission
			console.log(body.Playlists)
			await userSong.link(ctx.session.id, id)
			await playlistSong.create(body.Playlists, id)
			await ctx.redirect(`/songs/${id}`)
		}
	} catch(err) {
		console.log(err)
		await ctx.render('error', {msg: err.message})
	}
})

/**
 * The logout route, has no page.
 *
 * @name Logout Script
 * @route {GET} /logout
 */
router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.id = null
	ctx.redirect('/?msg=you are now logged out')
})

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
