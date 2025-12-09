// src/components/PlaceLabelLayer.jsx
import { useEffect } from 'react';
import { useMap } from '../contexts/MapContext';

function PlaceLabelLayer() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const addLayer = () => {
            if (map.getSource('places-wfs')) return;

            map.addSource('places-wfs', {
                type: 'geojson',
                data: '/geoserver/ocean/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ocean:ne_10m_populated_places&outputFormat=application/json'
            });

            map.addLayer({
                id: 'places-label',
                type: 'symbol',
                source: 'places-wfs',
                layout: {
                    'text-field': ['get', 'NAME'],
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': 12,
                    'text-offset': [0, 0.6],
                    'text-anchor': 'top',

                    'text-allow-overlap': false,
                    'text-ignore-placement': false,

                    'symbol-sort-key': ['get', 'SCALERANK']
                },
                paint: {
                    'text-color': '#ffffff',
                    'text-halo-color': '#000000',
                    'text-halo-width': 1.5
                },
                filter: ['<', ['get', 'SCALERANK'], 5]
            });
        };

        if (map.isStyleLoaded()) addLayer();
        else map.on('load', addLayer);

        return () => {
            if (map.getLayer('places-label')) map.removeLayer('places-label');
            if (map.getSource('places-wfs')) map.removeSource('places-wfs');
        };
    }, [map]);

    return null;
}

export default PlaceLabelLayer;
