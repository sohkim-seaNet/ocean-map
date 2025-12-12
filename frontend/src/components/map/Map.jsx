import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapContext } from '../../contexts/MapContext.js';
import { MaplibreExportControl, Size, PageOrientation, Format, DPI } from '@watergis/maplibre-gl-export';
import '@watergis/maplibre-gl-export/dist/maplibre-gl-export.css';

function Map({ source, center = [0, -70], zoom = 3, initialBearing = 0, children }) {
    const mapContainerRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);

    useEffect(() => {
        if (!mapContainerRef.current || !source) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: {
                version: 8,
                sources: {
                    'wms-source': {
                        type: 'raster',
                        tiles: source.tiles,
                        tileSize: 256
                    }
                },
                layers: [
                    {
                        id: 'background',
                        type: 'background',
                        paint: { 'background-color': '#000000' }
                    },
                    {
                        id: 'wms-layer',
                        type: 'raster',
                        source: 'wms-source'
                    }
                ]
            },
            center,
            zoom,
            bearing: initialBearing,
            preserveDrawingBuffer: true
        });

        // Export 컨트롤 추가
        map.addControl(new MaplibreExportControl({
            PageSize: Size.A4,
            PageOrientation: PageOrientation.Landscape,
            Format: Format.PNG,
            DPI: DPI[300],
            Crosshair: true,
            PrintableArea: true,
        }), 'top-left');

        setMapInstance(map);

        return () => {
            map.remove();
            setMapInstance(null);
        };
    }, [source, center, zoom, initialBearing]);

    return (
        <MapContext.Provider value={mapInstance}>
            <div ref={mapContainerRef} className="w-full h-full" />
            {children}
        </MapContext.Provider>
    );
}

export default Map;
