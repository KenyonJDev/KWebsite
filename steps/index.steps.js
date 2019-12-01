'use strict'

const { Given, When, Then } = require('cucumber')
const assert = require('assert')
const Page = require('./page.js')

let width = 800
let height = 600

let page

Given('the browser is open on the home page', async() => {
	page = await new Page(width, height)
})

When('I navigate to the {string} page', async route => {
	await page.goto(`http://localhost:8080/${route}`)
})

When('I enter {string} in the {string} field', async(value, field) => {
	await page.click(`#${field}`)
	await page.keyboard.type(value)
})

When('I click on the {string} button', async name => {
	await page.click(`#${name}`)
})

Then('take a screenshot called {string}', async filename => {
	await page.screenshot({path: `screenshots/${filename}.png`})
})

Then('the message box should say {string}', async msg => {
	const text = await page.evaluate( () => {
		const dom = document.querySelector('#msg')
		return dom.innerText
	})
	assert.equal(msg, text)
})

Then('the title should be {string}', async title => {
	const text = await page.evaluate( () => {
		const dom = document.querySelector('title')
		return dom.innerText
	})
	assert.equal(title, text)
})

Then('the list should contain {string} rows', async rows => {
	rows = Number(rows)
	const items = await page.evaluate( () => {
		const dom = document.querySelectorAll('table tr td:first-child')
		const arr = Array.from(dom)
		return arr.map(td => td.innerText)
	})
	assert.equal(items.length, rows)
})

