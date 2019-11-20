'use strict'

const sqlite = require('sqlite-async')

/**
 * @fileoverview The file where the Rating class exists.
 * @author Tiago Ferreira
 */

 /**
  * Class representing a Rating
  * Interacts with the database
  * @namespace
  */

class Rating {
    /**
	 * Song class constructor.
	 * Leave parameter empty to create db in memory.
	 * @constructor
	 * @param {string} [dbName=:memory:] - The database filename.
	 */
    constructor(dbName = ':memory:') {
        return (async() => {
            this.db = await sqlite.open(dbName)
            const sql = 'CREATE TABLE IF NOT EXISTS ratings' +
                        '(id INTEGER PRIMARY KEY AUTOINCREMENT, score INTEGER NOT NULL, comment TEXT NOT NULL)'
            await this.db.run(sql)
            return this
        })
    }

    /**
	 * Adds rating to the database.
	 * @async
	 * @param {Integer} rating - The playlist's rating.
	 * @returns {Promise<true>} A confirmation of insertion to the database.
	 */

    async addRating(rating, comment) {
        let sql = `INSERT INTO ratings(score, comment) \
                    VALUES("${rating}, ${comment}")`
        await this.db.run(sql)
        sql = 'SELECT last_insert_rowid() AS id' //retrieves last inserted auto increment id.
        let key = await this.db.get(sql)
        key = key.id
        console.log(key)
        return key
    }

    /**
	 * Retrieves a playlist's rating from the database.
	 * @async
	 * @param {number} key - The playlist's ID in the database.
	 * @returns {Promise<dbData>} The playlist's rating from the database.
	 */
	async get(key) {
		await check.key(key)
		const sql = `SELECT * FROM ratings WHERE id="${key}"`
		const data = await this.db.get(sql)
		if(data === undefined) throw new Error(`record for key ${key} does not exist`)
		return data
    }
    
    /**
	 * Retrieves all ratings from the database.
	 * @async
	 * @returns {Promise<Array<dbData>>} An array of ratings data from the database.
	 */
	async getAllRatings() {
		const sql = 'SELECT * FROM ratings'
		const data = await this.db.all(sql)
		return data
	}
}

module.exports = Rating