import { useState } from 'react';
import { useMap } from '../contexts/MapContext';

function RotateControl() {
    const map = useMap();
    const [bearing, setBearing] = useState(0);

    const rotateRight = () => {
        if (!map) return;
        const next = (bearing + 45) % 360;
        setBearing(next);
        map.rotateTo(next, { duration: 500 });
    };

    const resetNorth = () => {
        if (!map) return;
        setBearing(0);
        map.rotateTo(0, { duration: 300 });
    };

    return (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button
                type="button"
                onClick={rotateRight}
                className="px-2 py-1 bg-slate-800 text-white text-xs rounded"
            >
                Rotate +45°
            </button>
            <button
                type="button"
                onClick={resetNorth}
                className="px-2 py-1 bg-slate-800 text-white text-xs rounded"
            >
                North Up
            </button>
        </div>
    );
}

export default RotateControl;
