import { DATABASE_NAME, MONGO_URI } from 'modules/mongo/constants'

import { Client } from 'mongodb'

function connect(cb) {
    Client.connect(URI, (err, db) => {
        if (err) cb(err)
        else cb(null, db.db(DATABASE_NAME))
    })
}