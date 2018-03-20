import mapper from 'modules/place/mapper'
import { socketMapper } from 'utils/socket'

export default (io, socket) => socketMapper(socket, mapper, io)
