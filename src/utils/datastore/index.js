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

function resolveDataId(res) {
    res[0] = res[0].map(obj => {
        obj.id = obj[datastore.KEY].id
        return obj
    })
    return res
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
    return datastore.save(entity).then(()=>retrieve(kind, id))
}

export function retrieve(kind, id) {
    const key = datastore.key([ kind, datastore.int(id) ])
    return datastore.get(key).then(resolveDatastoreObject).catch(e => e)
}

export function query(kind, options) {
    const { pageSize, cursor, filters, orderBy } = options
    let query = datastore.createQuery(kind)
    if (filters) for (let filter of filters) query = query.filter(filter.field, filter.op, filter.value)
    if (orderBy) query = query.order(orderBy)
    if (pageSize) query = query.limit(pageSize)
    if (cursor) query = query.start(cursor)
    return datastore.runQuery(query).then(resolveDataId)
}
