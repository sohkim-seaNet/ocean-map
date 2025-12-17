import Map from '../components/map/Map.jsx';
import RotateControl from '../components/map/controls/RotateControl.jsx';
import CoordinatesControl from '../components/map/controls/CoordinatesControl';
import OwnShipControl from '../components/map/controls/OwnShipControl';
import MeasureControl from '../components/map/controls/MeasureControl';
import { basemaps } from '../config/basemaps';
import AnchoredShipsLayer from '../components/map/layers/AnchoredShipsLayer.jsx';
import LiveShipsLayer from '../components/map/layers/LiveShipsLayer.jsx';
import CoastlineLayer from '../components/map/layers/CoastlineLayer.jsx';
import PlaceLabelLayer from '../components/map/layers/PlaceLabelLayer.jsx';

function GebcoMap() {
    return (
        <div className="relative w-full h-full">
            <Map source={basemaps.GEBCO} center={[0, -70]} zoom={3} initialBearing={0}>
                {/* Layers */}
                <CoastlineLayer />
                <PlaceLabelLayer />
                <AnchoredShipsLayer />
                <LiveShipsLayer />

                {/* Controls */}
                <RotateControl />
                <OwnShipControl />
                <CoordinatesControl />
                <MeasureControl />
            </Map>
        </div>
    );
}

export default GebcoMap;
