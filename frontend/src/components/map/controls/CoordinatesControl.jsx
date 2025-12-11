import { useEffect, useState } from 'react';
import { useMap } from '../../../contexts/MapContext';

function CoordinatesControl() {
    const map = useMap();
    const [coords, setCoords] = useState({ lng: 0, lat: 0 });

    useEffect(() => {
        if (!map) return;

        const onMouseMove = (e) => {
            setCoords(e.lngLat.wrap());
        };

        map.on('mousemove', onMouseMove);

        return () => {
            map.off('mousemove', onMouseMove);
        };
    }, [map]);

    if (!map) return null;

    return (
        <div className="absolute bottom-4 left-4 z-10 bg-slate-800/90 text-white px-3 py-1 rounded text-sm font-mono tabular-nums pointer-events-none shadow-md">
            위도: {coords.lat.toFixed(4)} | 경도: {coords.lng.toFixed(4)}
        </div>
    );
}

export default CoordinatesControl;
