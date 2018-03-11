import { DATABASE_NAME, MONGO_URI } from 'modules/mongo/constants'

import Mongo from 'mongodb-bluebird'

function connect(collection) {
    return Mongo.connect(MONGO_URI).then(db => db.collection(collection)).catch(err => err)
}

export function create(collectionName, data) {
    return connect(collectionName).then(collection => collection.insert(data)).catch(err => err)
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
        collection.findOne({}, target, (err, res) => {
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
