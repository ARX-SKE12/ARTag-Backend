import mapper from 'modules/collaborate/mapper'
import { socketMapper } from 'utils/socket'

export default (io, socket) => socketMapper(socket, mapper, io)
