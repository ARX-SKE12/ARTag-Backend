import Datastore from '@google-cloud/datastore'
import PROJECT_ID from 'modules/datastore/constants'

const datastore = Datastore({ projectId: PROJECT_ID })

export function create(kind, data) {
    const key = datastore.key([ kind ])
    const entity = { key, data }
    return datastore.save(entity)
}

export function update(kind, id, data) {
    const key = datastore.key([ kind, datastore.int(id) ])
    const entity = { key, data }
    return datastore.save(entity)
}

export function retrieve(kind, id) {
    const key = datastore.key([ kind, datastore.int(id) ])
    return datastore.get(key)
}

export function list(kind) {
    const key = datastore.key([ kind ])
    const query = datastore.createQuery(key)
    return datastore.runQuery(query)
}
