'use strict'

const sqlite = require('sqlite-async')
const mm = require('music-metadata')
const path = require('path')

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
                        '(id INTEGER PRIMARY KEY AUTOINCREMENT, score INTEGER NOT NULL)'
            await this.db.run(sql)
            return this
        })
    }
}