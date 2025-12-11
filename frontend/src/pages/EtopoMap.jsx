import Map from '../components/map/Map.jsx';
import { basemaps } from '../config/basemaps';

function EtopoMap() {
    return <Map source={basemaps.ETOPO} center={[0, 0]} zoom={1.5} />
}

export default EtopoMap;
