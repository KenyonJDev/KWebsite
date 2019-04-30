
'use strict'

const records = [
	{
		user: 'jdoe',
		pass: '$2b$10$vPqO/uGlKchrQCqyBIKdb.8hLEJgaC4aAg4fpre5rausycX1XmkWy'
	}
]

//const sql = 'SELECT count(id) AS count FROM users WHERE user="jdoe";'
const sql = 'SELECT user FROM users WHERE user="jdoe"'
const field = sql.match(/(?<=SELECT\s+).*?(?=\s+FROM)/g)[0]
const condition = sql.match(/\bWHERE\s+(.*)$/g)[0].replace('WHERE ', '').replace(';', '')
const key = condition.split('=')[0]
const val = condition.split('=')[1].replace(/"/g, '')
console.log(field)
console.log(key)
console.log(val)

let data = []
for(const record of records) if(record[key] == val) data.push(record[key])
let result = {}
if(field === 'count(id) AS count') {
    result.count = data.length
} else {
    result[field] = val
}
console.log(result)