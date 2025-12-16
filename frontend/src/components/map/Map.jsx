import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { MapContext } from '../../contexts/MapContext.js';

import {
    MaplibreExportControl,
    Size,
    PageOrientation,
    Format,
    DPI
} from '@watergis/maplibre-gl-export';
import '@watergis/maplibre-gl-export/dist/maplibre-gl-export.css';

function Map({ source, center = [0, -70], zoom = 3, initialBearing = 0, children }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const exportControlRef = useRef(null);

    const [mapInstance, setMapInstance] = useState(null);

    // 초기 스타일(최초 map 생성용). 이후 basemap은 source effect에서 항상 동기화.
    const initialStyle = useMemo(() => {
        const tiles = source?.tiles ?? [];
        return {
            version: 8,
            sources: {
                'wms-source': { type: 'raster', tiles, tileSize: 256 }
            },
            layers: [
                { id: 'background', type: 'background', paint: { 'background-color': '#000000' } },
                { id: 'wms-layer', type: 'raster', source: 'wms-source' }
            ]
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 1) Map 생성 (1회)
    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: initialStyle,
            center,
            zoom,
            bearing: initialBearing,
            preserveDrawingBuffer: true
        });

        mapRef.current = map;
        window.__map = map;

        map.once('load', () => {
            // 1-1) Export control 부착(1회)
            if (!exportControlRef.current) {
                exportControlRef.current = new MaplibreExportControl({
                    PageSize: Size.A4,
                    PageOrientation: PageOrientation.Landscape,
                    Format: Format.PNG,
                    DPI: DPI[300],
                    Crosshair: true,
                    PrintableArea: true
                });
            }
            map.addControl(exportControlRef.current, 'top-left');

            setMapInstance(map);
        });

        return () => {
            setMapInstance(null);
            map.remove();
            mapRef.current = null;
            delete window.__map;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2) Basemap(source/layer) 렌더링/교체
    useEffect(() => {
        const map = mapRef.current;
        const tiles = source?.tiles;

        if (!map || !tiles?.length) return;

        const applyBasemap = () => {
            const src = map.getSource('wms-source');
            if (src && typeof src.setTiles === 'function') {
                src.setTiles(tiles);
                return;
            }

            // 없거나 setTiles 미지원이면, 레이어 -> 소스 순으로 제거 후 재등록
            if (map.getLayer('wms-layer')) map.removeLayer('wms-layer'); // layer 먼저
            if (map.getSource('wms-source')) map.removeSource('wms-source'); // 그 다음 source

            map.addSource('wms-source', { type: 'raster', tiles, tileSize: 256 });
            map.addLayer({ id: 'wms-layer', type: 'raster', source: 'wms-source' });
        };

        // style 로딩 전이면 style.load 이후에 적용(스타일 완전 로딩 시점 보장)
        if (!map.isStyleLoaded()) {
            const onStyleLoad = () => {
                applyBasemap();
                map.off('style.load', onStyleLoad);
            };
            map.on('style.load', onStyleLoad);
            return () => map.off('style.load', onStyleLoad);
        }

        applyBasemap();
    }, [source]);

    // 3) View 업데이트(center/zoom/bearing)
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        map.jumpTo({ center, zoom, bearing: initialBearing });
    }, [center, zoom, initialBearing]);

    return (
        <MapContext.Provider value={mapInstance}>
            <div ref={mapContainerRef} className="w-full h-full" />
            {mapInstance ? children : null}
        </MapContext.Provider>
    );
}

export default Map;
