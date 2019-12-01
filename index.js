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
const koaBody = require('koa-body')({ multipart: true, uploadDir: '.' })
const session = require('koa-session')

/* IMPORT ROUTE MODULES */
const getHome = require('./routes/home.get')
const postRegister = require('./routes/register.post')
const getLogin = require('./routes/login.get')
const postLogin = require('./routes/login.post')
const getSongs = require('./routes/songs.get')
const getSongDetails = require('./routes/songDetails.get')
const getPlaylists = require('./routes/playlists.get')
const postPlaylists = require('./routes/playlists.post')
const postPlaylistAdd = require('./routes/playlistAdd.post')
const getLibrary = require('./routes/library.get')
const getLibraryDetails = require('./routes/libraryDetails.get')
const getBrowse = require('./routes/browse.get')
const getUpload = require('./routes/upload.get')
const postUpload = require('./routes/upload.post')
const postComment = require('./routes/comment.post')
const getDeleteSong = require('./routes/deleteSong.get')
const getDeleteComment = require('./routes/deleteComment.get')
const getLogout = require('./routes/logout.get')

const app = new Koa()
const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, { map: { handlebars: 'handlebars' } }))

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
router.get('/playlists', async ctx => await getPlaylists(ctx, dbName))

/**
 * The script to process new playlist creations.
 * @name Playlist script
 * @route {POST} /playlists
 */
router.post('/playlists', koaBody, async ctx => await postPlaylists(ctx, dbName))

/**
 * The script to process adding a song to a playlist.
 * @name PlaylistAdd script
 * @route {POST} /playlistAdd
 */
router.post('/playlistAdd', koaBody, async ctx => await postPlaylistAdd(ctx, dbName))

/**
 * The user playlists page AKA Library.
 *
 * @name Library Page
 * @route {Get} /library
 */
router.get('/library', async ctx => await getLibrary(ctx, dbName))

/**
 * The individual playlist page.
 * @name Library/id Page
 * @route {Get} /library
 */
router.get('/library/:id', async ctx => await getLibraryDetails(ctx, dbName))

/**
 * The page that displays all the playlists in the database.
 *
 * @name Browse Page
 * @route {Get} /browse
 */
router.get('/browse', async ctx => await getBrowse(ctx, dbName))

/**
 * The page responsible for uploading songs.
 *
 * @name Upload Page
 * @route {GET} /upload
 */
router.get('/upload', async ctx => await getUpload(ctx, dbName))

/**
 * The script that handles uploading music.
 * @name Upload script
 * @route {POST} /upload
 */
router.post('/upload', koaBody, async ctx => await postUpload(ctx, dbName, __dirname))

/**
 * The script responsible for adding playlist comments.
 * @name Comment script
 * @route {POST} /comment
 */
router.post('/comment', koaBody, async ctx => await postComment(ctx, dbName))

/**
 * The song delete script.
 * @name Delete song page
 * @route {GET} /delete-song/:id
 */
router.get('/delete-song/:id', async ctx => await getDeleteSong(ctx, dbName))

/**
 * The comment delete script.
 * @name Delete comment
 * @route {GET} /delete-com/:id
 */
router.get('/delete-com/:id', async ctx => await getDeleteComment(ctx, dbName))

/**
 * The upload page.
 * @name Logout page
 * @route {GET} /logout
 */
router.get('/logout', async ctx => await getLogout(ctx))

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
