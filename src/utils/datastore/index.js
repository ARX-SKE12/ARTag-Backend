import { KEYFILE, PROJECT_ID } from 'utils/datastore/constants'

import Datastore from '@google-cloud/datastore'
import to from 'await-to-js'

const datastore = Datastore({ projectId: PROJECT_ID, keyFilename: KEYFILE })

function resolveDatastoreObjectId(datum) {
    datum.id = datum[datastore.KEY].id
    return datum
}

function resolveDatastoreObject(data) {
    return resolveDatastoreObjectId(data[0])
}

function resolveDatastoreList(res) {
    const data = res[0]
    return data.map(resolveDatastoreObjectId)
}

export function create(kind, data) {
    const key = datastore.key([ kind ])
    const entity = { key, data }
    return datastore.save(entity)
}

export async function update(kind, id, data) {
    const key = datastore.key([ kind, datastore.int(id) ])
    const [ err, updateData ] = await to(retrieve(kind, id))
    if (err) throw err
    for (const props in data)
        updateData[props] = data[props]
    const entity = { key, data: updateData }
    return datastore.save(entity)
}

export function retrieve(kind, id) {
    const key = datastore.key([ kind, datastore.int(id) ])
    return datastore.get(key).then(resolveDatastoreObject).catch(e => e)
}

export function list(kind) {
    const query = datastore.createQuery(kind)
    return datastore.runQuery(query).then(resolveDatastoreList).catch(err => err)
}

export function queryFilter(kind, filters) {
    let query = datastore.createQuery(kind)
    for (let filter of filters) query = query.filter(filter.field, filter.op, filter.value)
    return datastore.runQuery(query).then(resolveDatastoreList).catch(err => err)
}
