import Datastore from '@google-cloud/datastore'
import PROJECT_ID from 'utils/datastore/constants'
import to from 'await-to-js'

const datastore = Datastore({ projectId: PROJECT_ID })

export function create(kind, data) {
    const key = datastore.key([ kind ])
    const entity = { key, data }
    console.log(entity)
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
    return datastore.get(key).then(data => data[0]).catch(e => e)
}

export function list(kind) {
    const query = datastore.createQuery(kind)
    return datastore.runQuery(query)
}
