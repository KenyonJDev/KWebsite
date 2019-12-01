'use strict'

const { Given, When, Then } = require('cucumber')
const assert = require('assert')
const Page = require('./page.js')

const width = 1036
const height = 764

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

When('I select an mp3 file called {string}', async name => {
	const uploadField = await page.$('#song')
	await uploadField.uploadFile(`unit\ tests/${name}.mp3`)
})

When('I select a photo in the album art field', async() => {
	const uploadField = await page.$('#art')
	await uploadField.uploadFile('unit\ tests/sample.jpg')
})

When('I select the {string} playlist', async name => {
	// The line below is from StackOverflow:
	// https://stackoverflow.com/questions/49116472/puppeteer-how-select-a-dropdown-option-based-from-its-text
	const option = (await page.$x(`//*[@id="playlist"]/option[text()="${name}"]`))[0]
	const id = await (await option.getProperty('value')).jsonValue()
	await page.select('#playlist', id)
})

When('I select the {string} song', async name => {
	// The line below is from StackOverflow:
	// https://stackoverflow.com/questions/49116472/puppeteer-how-select-a-dropdown-option-based-from-its-text
	const option = (await page.$x(`//*[@id="song"]/option[text()="${name}"]`))[0]
	const id = await (await option.getProperty('value')).jsonValue()
	await page.select('#song', id)
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

