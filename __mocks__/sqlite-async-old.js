
'use strict'

const records = [
	{
		id: 0,
		user: 'jdoe',
		pass: '$2b$10$vPqO/uGlKchrQCqyBIKdb.8hLEJgaC4aAg4fpre5rausycX1XmkWy'
	}
]

module.exports.open = function() {
	return {
		all: async sql => {
			console.log(`MOCK ${sql}`)
			let field = sql.match(/(?<=SELECT\s+).*?(?=\s+FROM)/g)[0]
			const condition = sql.match(/\bWHERE\s+(.*)$/g)[0].replace('WHERE ', '').replace(';', '')
			const key = condition.split('=')[0].trim()
			const val = condition.split('=')[1].replace(/"/g, '').trim()
			console.log(`field: "${field}", condition: "${condition}", key: "${key}", val: "${val}"`)
			if(field === 'count(id) AS count') field = 'id'
			console.log(`field: "${field}"`)
			let data = []
			console.log(`${field} : ${key} : ${val}`)
			for(const record of records) {
				//console.log(record)
				console.log(record[field])
				console.log(`"${record[field]}" : "${val}"`)
				if(record[field] == val) {
					console.log('matching record')
					data.push(record)
				}
			}
			console.log(data)
			let result = {}
			console.log(`field ${field} length: ${field.length}`)
			if(field === 'id') {
				console.log('need count...')
    			result.count = data.length
			} else {
				console.log('need data...')
    			result[field] = records[0][field]
			}
			console.log(result)
			return result
		},
		run: async() => true, // we can just ignore these.
		close: async() => true // pretend to close the database.
	}
}

