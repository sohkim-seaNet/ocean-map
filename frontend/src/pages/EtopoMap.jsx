import Map from '../components/Map';
import { basemaps } from '../config/basemaps';

function EtopoMap() {
    return <Map source={basemaps.ETOPO} center={[0, 0]} zoom={1.5} />
}

export default EtopoMap;
