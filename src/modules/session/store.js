import { GC_APP_CREDENTIALS, GC_PROJECT_ID, SESSION_PREFIX } from 'modules/session/constants'

import ConnectDatastore from '@google-cloud/connect-datastore'
import Datastore from '@google-cloud/datastore'
import ExpressSession from 'express-session'

const DatastoreStore = ConnectDatastore(ExpressSession)

export default new DatastoreStore({
    dataset: Datastore({
        prefix: SESSION_PREFIX,
        projectId: GC_PROJECT_ID,
        keyFilename: GC_APP_CREDENTIALS
    })
})