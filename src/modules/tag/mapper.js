import createTag from 'modules/tag/actions/createTag'
import events from 'modules/tag/events'
import listTag from 'modules/tag/actions/listTag'
import updateTag from 'modules/tag/actions/updateTag'

export default [
    {
        event: events.TAG_CREATE,
        action: createTag
    },
    {
        event: events.TAG_UPDATE,
        action: updateTag
    },
    {
        event: events.TAG_LIST_REQUEST,
        action: listTag
    }
]