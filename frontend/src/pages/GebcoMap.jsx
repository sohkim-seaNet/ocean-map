import Map from '../components/Map';
import { basemaps } from '../config/basemaps';
import AnchoredShipsLayer from '../components/AnchoredShipsLayer';
import LiveShipsLayer from '../components/LiveShipsLayer';
import CoastlineLayer from '../components/CoastlineLayer';
import PlaceLabelLayer from '../components/PlaceLabelLayer';

function GebcoMap() {
    return (
        <Map source={basemaps.GEBCO} center={[0, -70]} zoom={3}>
            <CoastlineLayer />
            <PlaceLabelLayer />
            <AnchoredShipsLayer />
            <LiveShipsLayer />
        </Map>
    );
}

export default GebcoMap;
