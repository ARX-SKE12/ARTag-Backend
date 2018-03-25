import mapper from 'modules/plane/mapper'
import { socketMapper } from 'utils/socket'

export default (io, socket) => socketMapper(socket, mapper, io)