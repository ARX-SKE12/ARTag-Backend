import { retrieve, update } from 'utils/datastore'

import { PLACE_KIND } from '../../place/constants';

export default (socket, tagData, io) => {
    retrieve(PLACE_KIND)
}
