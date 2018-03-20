import createTag from 'modules/tag/actions/createTag'
import editTag from 'modules/tag/actions/editTag'
import events from 'modules/tag/events'
import removeTag from 'modules/tag/actions/removeTag'

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
        event: events.TAG_REMOVE,
        action: removeTag
    }
]