import { useEffect } from 'react';
import { useMap } from '../contexts/MapContext';

function CoastlineLayer() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const addLayer = () => {
            if (map.getSource('coastline-wms')) return;

            map.addSource('coastline-wms', {
                type: 'raster',
                tiles: [
                    `/geoserver/ocean/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=ocean:ne_10m_coastline&SRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`
                ],
                tileSize: 256
            });

            map.addLayer({
                id: 'coastline-layer',
                type: 'raster',
                source: 'coastline-wms',
                paint: { 'raster-opacity': 1.0 },
            });
        };

        if (map.isStyleLoaded()) addLayer();
        else map.on('load', addLayer);

        return () => {
            if (map.getLayer('coastline-layer')) map.removeLayer('coastline-layer');
            if (map.getSource('coastline-wms')) map.removeSource('coastline-wms');
        };
    }, [map]);

    return null;
}

export default CoastlineLayer;
