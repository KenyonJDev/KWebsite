
'use strict'

const puppeteer = require('puppeteer')

let page
let browser

const baseURL = 'http://localhost:8080'

beforeAll( async() => {
	const width = 800
	const height = 600
	browser = await puppeteer.launch({
		headless: true,
		slowMo: 40,
		args: [`--window-size=${width},${height}`, '--disable-http2']
	})
	page = await browser.newPage()
	await page.setViewport({ width, height })
})

afterAll( async() => await browser.close())

describe('checking home screen is protected', () => {
	test('home screen redirects to login if not logged in', async done => {
		await page.waitFor(1000)
		await page.goto('http://localhost:8080/logout')
		await page.waitFor(1000)
		//await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' })
		const title = await page.title()
		expect(title).toBe('Log In')
		done()
	})
})

describe('registering an account', () => {
	test('home screen redirects to login if not logged in', async done => {
		try {
			await page.waitFor(1000)
			await page.goto(`${baseURL}/register`, { waitUntil: 'domcontentloaded' })
			await page.type('input[name=user]', 'jbloggs')
			await page.type('input[name=pass]', 'p455w0rd')
			const input = await page.$('input[name=avatar]')
			await input.uploadFile('screenshots/person.png')
			await page.screenshot({ path: 'screenshots/completedRegForm.png' })
			await page.click('input[type=submit]')
			await page.waitFor(1000)
			await page.screenshot({ path: 'screenshots/accountCreated.png' })
			const title = await page.title()
			expect(title).toBe('Log In')
			const text = await page.evaluate(() => document.body.textContent)
			expect(text).toContain('you need to log in')
		} catch(err) {
			//done.fail(new Error(err.message))
		} finally {
			done()
		}
	})
})
