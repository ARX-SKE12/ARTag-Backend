import { create, list, retrieve, update } from 'utils/datastore'

export default class Model {
    
    constructor(kind, fields) {
        this.kind = kind
        this.fields = fields
    }

    async create(data) {
        //if (Object.keys(data).length)
    }

    retrieve(id) {

    }

    update(id, data) {

    }

    list() {
        
    }
    
}
