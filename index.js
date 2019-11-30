/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
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
const UserSong = require('./modules/userSong')
const UserPlaylist = require('./modules/User_playlists')
const UserComment = require('./modules/userComment')
const Song = require('./modules/song')
const Comment = require('./modules/comment')
const Playlists = require('./modules/playlists')
const PlaylistSongs = require('./modules/Playlist_songs')
const PlaylistComment = require('./modules/playlistComment')


/* IMPORT ROUTE MODULES */
const getHome = require('./routes/home.get')
const postRegister = require('./routes/register.post')
const getLogin = require('./routes/login.get')
const postLogin = require('./routes/login.post')
const getSongs = require('./routes/songs.get')
const getSongDetails = require('./routes/songDetails.get')

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
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => await getHome(ctx))

/**
 * The user registration page.
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => await postRegister(ctx, dbName))

/**
 * The secure login page.
 * @name Login Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/login', async ctx => await getLogin(ctx))

/**
 * The script to process user logging in.
 * @name Login script
 * @route {POST} /login
 */
router.post('/login', async ctx => await postLogin(ctx, dbName))

/**
 * The songs page.
 * @name Songs page
 * @route {GET} /songs
 */
router.get('/songs', async ctx => await getSongs(ctx, dbName))

/**
 * The individual song page.
 *
 * @name Songs/id Page
 * @route {Get} /songs
 */
router.get('/songs/:id', async ctx => await getSongDetails(ctx, dbName))

/**
 * The playlist creation page.
 *
 * @name Playlists Page
 * @route {Get} /playlists
 */
// eslint-disable-next-line complexity
router.get('/playlists', async ctx => {
	try {
		if(ctx.session.authorised !== true) await ctx.redirect('/login?msg=you need to login')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		// Making necessary objects
		const userPlaylist = await new UserPlaylist(dbName)
		const userSong = await new UserSong(dbName)
		const song = await new Song(dbName)
		const playlist = await new Playlists(dbName)
		const songs = [], playlists = []
		// Getting song names
		const songIDs = await userSong.get(ctx.session.id)
		for(const id of songIDs) {
			const details = await song.get(id.songID)
			songs.push(details)
		}
		// Getting playlist names
		const playlistIDs = await userPlaylist.getUserPlaylists(ctx.session.id)
		for(const id of playlistIDs) {
			const details = await playlist.getPlaylist(id)
			playlists.push(details)
		}
		data.songs = songs, data.playlists = playlists
		await ctx.render('playlists', data)
	} catch(err) {
		console.log(err)
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The script to process new playlist creations.
 * @name Playlist script
 * @route {POST} /playlists
 */
router.post('/playlists', koaBody, async ctx => {
	try{
		if(ctx.session.authorised !== true)
			await ctx.redirect('/login?msg=You need to log in')
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
		//await ctx.redirect(`/library/${playlistID}`)
		await ctx.redirect(`/playlists?msg=new playlist "${body.name}" created`)
	}catch(err) {
		console.log(err)
		await ctx.render('playlists', {err: err.message})
	}
})

router.post('/playlistAdd', koaBody, async ctx => {
	try {
		const {song, playlist} = ctx.request.body
		const playlistSong = await new PlaylistSongs(dbName)
		await playlistSong.create(playlist, song)
		await ctx.redirect(`/library/${playlist}?msg=Song added!`)
	} catch(err) {
		console.log(err)
		await ctx.redirect(`/playlists?msg=${err.message}`)
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
 * @name Library/id Page
 * @route {Get} /library
 */
// eslint-disable-next-line complexity
router.get('/library/:id', async ctx => {
	try {
		// Getting all the necessary objects ready
		const user = await new User(dbName) // User details
		const song = await new Song(dbName) // Song details
		const playlist = await new Playlists(dbName) // Playlist details
		const comment = await new Comment(dbName) // Comment details
		const playlistsong = await new PlaylistSongs(dbName) // List of playlist songs
		const userComment = await new UserComment(dbName) // List of user comments
		const playlisComment = await new PlaylistComment(dbName) // List of playlist comments
		// Retrieving data from the database to display on the page
		const data = await playlist.getPlaylist(ctx.params.id)
		const songs = await playlistsong.getPlaylistSongs(ctx.params.id)
		const songsList = [], commentList = []
		// Putting song data into a list
		for(const id of songs) songsList.push(await song.get(id))
		data.songs = songsList
		// Putting ccomments into a list
		const commentIDs = await playlisComment.get(ctx.params.id)
		for(const id of commentIDs) {
			const detail = {}
			const owner = await userComment.getOwner(id)
			detail.id = id
			detail.user = await user.get(owner)
			detail.comment = await comment.get(id)
			if(ctx.session.id === owner) detail.owner = true
			commentList.push(detail)
		}
		data.comments = commentList
		data.id = ctx.params.id
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('collection', data)
	} catch(err) {
		console.log(err)
		await ctx.render('error', err.message)
	}
})

/**
 * The page that displays all the playlists in the database.
 *
 * @name Browse Page
 * @route {Get} /browse
 */
router.get('/browse', async ctx => {
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
 * The script that handles uploading music.
 * @name Upload script
 * @route {POST} /upload
 */
// eslint-disable-next-line max-lines-per-function
router.post('/upload', koaBody, async ctx => {
	try {
		if(!ctx.session.authorised) await ctx.redirect('/login?msg=You need to log in')
		const body = ctx.request.body
		const song = await new Song(dbName)
		const {path, type} = ctx.request.files.song
		const id = await song.add(await song.extractTags(path, type))
		await fs.copySync(path, `public/music/${id}.mp3`)
		const userSong = await new UserSong(dbName)
		const playlistSong = await new PlaylistSongs(dbName)
		//prints id of selected playlist, can be removed before submission
		await userSong.link(ctx.session.id, id)
		await playlistSong.create(body.Playlists, id)
		await ctx.redirect(`/songs/${id}`)
	} catch(err) {
		console.log(err)
		await ctx.render('upload', {msg: err.message})
	}
})

router.post('/comment', koaBody, async ctx => {
	try {
		if(!ctx.session.authorised) await ctx.redirect('/login?msg=You need to log in')
		const body = ctx.request.body
		console.log(body)
		const id = body.id
		const playlistID = body.id, userID = ctx.session.id
		const comment = await new Comment(dbName)
		const userComment = await new UserComment(dbName)
		const playlistComment = await new PlaylistComment(dbName)
		const commentID = await comment.add(body.comment)
		await userComment.link(userID, commentID)
		await playlistComment.link(playlistID, commentID)
		await ctx.redirect(`/library/${id}`)
	} catch(err) {
		console.log(err)
		await ctx.render('error', err.message)
	}
})

/**
 * The song details page.
 * @name Song details page
 * @route {GET} /upload/:id
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
 * The song delete page.
 * @name Delete song page
 * @route {GET} /delete-song/:id
 */
router.get('/delete-song/:id', async ctx => {
	try {
		const userSong = await new UserSong(dbName)
		const playlistSong = await new PlaylistSongs(dbName)
		const user = ctx.session.id
		const owner = await userSong.check(ctx.params.id)
		if(user !== owner) return ctx.redirect('/login?msg=you are not the owner of this file')
		await userSong.remove(ctx.params.id)
		await playlistSong.remove(ctx.params.id)
		const song = await new Song(dbName)
		await song.delete(ctx.params.id)
		ctx.redirect('/?msg=song deleted!')
	} catch(err) {
		console.log(err)
		await ctx.render('error', err.message)
	}
})

router.get('/delete-com/:id', async ctx => {
	try {
		const userComment = await new UserComment(dbName)
		const comment = await new Comment(dbName)
		const playlistComment = await new PlaylistComment(dbName)
		await playlistComment.delete(ctx.params.id)
		await userComment.delete(ctx.params.id)
		await comment.delete(ctx.params.id)
		await ctx.redirect('back')
	} catch(err) {
		console.log(err)
		await ctx.redirect('error', err.message)
	}
})

/**
 * The upload page.
 * @name Logout page
 * @route {GET} /logout
 */
router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.id = null
	ctx.redirect('/?msg=you are now logged out')
})

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
