import { DATABASE_NAME, MONGO_URI } from 'modules/mongo/constants'

import Mongo from 'mongodb-bluebird'

function connect(collection) {
    return Mongo.connect(MONGO_URI).then(db => db.collection(collection)).catch(err => err)
}

export function create(collectionName, data) {
    return connect(collectionName).then(collection => collection.insert(data)).catch(err => err)
}

export function update(collectionName, id, data) {
    return connect(collectionName).then(collection => collection.updateById(id, data)).catch(err => err)
}

export function retrieve(collectionName, id) {
    return connect(collectionName).then(collection => collection.findById(id)).catch(err => err)
}

export function list(collectionName) {
    return connect(collectionName).then(collection => collection.find()).catch(err => err)
}
