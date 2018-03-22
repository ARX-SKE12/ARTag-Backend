import createTag from 'modules/tag/actions/createTag'
import editTag from 'modules/tag/actions/editTag'
import events from 'modules/tag/events'
import listTag from 'modules/tag/actions/listTag'

export default [
    {
        event: events.TAG_CREATE,
        action: createTag
    },
    {
        event: events.TAG_EDIT,
        action: editTag
    },
    {
        event: events.TAG_LIST_REQUEST,
        action: listTag
    }
]