import { useEffect } from 'react';
import { useMap } from '../../../contexts/MapContext.js';

/**
 * AnchoredShipsLayer 컴포넌트
 * GeoServer WMS를 통해 고정된 선박 데이터를 래스터 타일로 표시
 */
function AnchoredShipsLayer() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const onLoad = () => {
            if (map.getSource('ships')) return;

            map.addSource('ships', {
                type: 'raster',
                tiles: [
                    '/geoserver/ocean/wms?' +
                    'service=WMS&request=GetMap&version=1.1.1&' +
                    'layers=ocean:ships&' +
                    'styles=&bbox={bbox-epsg-3857}&' +
                    'width=256&height=256&srs=EPSG:3857&' +
                    'format=image/png&transparent=true'
                ],
                tileSize: 256
            });

            map.addLayer({
                id: 'ships-layer',
                type: 'raster',
                source: 'ships'
            });
        };

        if (map.isStyleLoaded()) {
            onLoad();
        } else {
            map.on('load', onLoad);
            return () => map.off('load', onLoad);
        }
    }, [map]);

    return null;
}

export default AnchoredShipsLayer;
