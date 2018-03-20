import { retrieve, update } from 'utils/datastore'

import { PLACE_KIND } from '../../place/constants';

export default (io, socket, tagData) => {
    retrieve(PLACE_KIND)
}
