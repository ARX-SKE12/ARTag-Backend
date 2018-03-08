import { DATABASE_NAME, MONGO_URI } from 'modules/mongo/constants'

import { Client } from 'mongodb'

function connect(collection, cb) {
    Client.connect(URI, (err, db) => {
        if (err) cb(err)
        else cb(null, db.db(DATABASE_NAME).collection(collection))
        db.close()
    })
}

export function create(collection, data, cb) {
    connect(collection, (err, collection) => {
        if (err) cb(err)
        else collection.insertOne(data, (err, res) => {
            if (err) cb(err)
            else cb(null, res)
        })
    })
}

export function update(collection, target, data, cb) {
    connect(collection, (err, collection) => {
        const updateData = {
            $set: data
        }
        if (err) cb(err)
        else collection.updateOne(target, updateData, (err, res) => {
            if (err) cb(err)
            else cb(null, res)
        })
    }) 
}

export function retrieve(collection, target, cb) {
    connect(collection, (err, collection) => {
        collection.find({}, target, (err, res) => {
            if (err) cb(err)
            else cb(null, res)
        })
    })
}

export function list(collection, cb) {
    connect(collection, (err, collection) => {
        collection.find({}, (err, res) => {
            if (err) cb(err)
            else cb(null, res)
        })
    })
}
