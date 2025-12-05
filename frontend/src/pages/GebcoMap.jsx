import Map from '../components/Map';
import { basemaps } from '../config/basemaps';
import AnchoredShipsLayer from '../components/AnchoredShipsLayer';
import LiveShipsLayer from '../components/LiveShipsLayer';

function GebcoMap() {
    return (
        <div className="w-full h-full">
            <Map source={basemaps.GEBCO} center={[0, -70]} zoom={3}>
                <AnchoredShipsLayer />
                <LiveShipsLayer />
            </Map>
        </div>
    );
}

export default GebcoMap;
