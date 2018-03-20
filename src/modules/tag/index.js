import mapper from 'modules/tag/mapper'
import { socketMapper } from 'utils/socket'

export default (io, socket) => socketMapper(socket, mapper)
