import mapper from 'modules/room/mapper'
import { socketMapper } from 'utils/socket'

export default (io, socket) => socketMapper(socket, mapper, io)