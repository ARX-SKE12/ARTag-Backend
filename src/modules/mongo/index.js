import { DATABASE_NAME, MONGO_URI } from 'modules/mongo/constants'

import { MongoClient } from 'mongodb'

function connect(collection, cb) {
    MongoClient.connect(MONGO_URI, (err, db) => {
        if (err) cb(err)
        else cb(null, db.db(DATABASE_NAME).collection(collection))
        db.close()
    })
}

export function create(collectionName, data, cb) {
    connect(collectionName, (err, collection) => {
        if (err) cb(err)
        else collection.insertOne(data, (err) => {
            if (err) cb(err)
            else cb(null, data)
        })
    })
}

export function update(collectionName, target, data, cb) {
    connect(collectionName, (err, collection) => {
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

export function retrieve(collectionName, target, cb) {
    connect(collectionName, (err, collection) => {
        collection.find({}, target, (err, res) => {
            if (err) cb(err)
            else cb(null, res)
        })
    })
}

export function list(collectionName, cb) {
    connect(collectionName, (err, collection) => {
        collection.find().toArray((err, res) => {
            if (err) cb(err)
            else cb(null, res)
        })
    })
}
