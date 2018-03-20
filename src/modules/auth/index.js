import mapper from 'modules/auth/mapper'
import { socketMapper } from 'utils/socket'

export default socket => socketMapper(socket, mapper)
