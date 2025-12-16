import { useEffect, useRef } from 'react';
import { useMap } from '../../../contexts/MapContext.js';
import { makeScheduledEnsure } from '../utils/scheduleEnsure.js';

const ICON_ID = 'ship-live-icon';
const SOURCE_ID = 'ships-current';
const LAYER_ID = 'ships-current-layer';

function LiveShipsLayer() {
    const map = useMap();

    const intervalRef = useRef(null);
    const imgRef = useRef(null);
    const loadingRef = useRef(false); // 중복 로드 방지

    useEffect(() => {
        if (!map) return;

        const wfsUrl =
            '/geoserver/ocean/ows?' +
            'service=WFS&version=1.0.0&request=GetFeature&' +
            'typeName=ocean:ships_current&' +
            'outputFormat=application/json';

        const addIconIfNeeded = () => {
            if (!map.getStyle || !map.getStyle()) return;
            if (map.hasImage && map.hasImage(ICON_ID)) return;
            if (loadingRef.current) return;

            loadingRef.current = true;

            const img = imgRef.current ?? new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                loadingRef.current = false;
                if (!map.getStyle || !map.getStyle()) return;
                if (map.hasImage && map.hasImage(ICON_ID)) return;

                try {
                    map.addImage(ICON_ID, img);
                } catch (e) {
                    console.debug('[map] addImage skipped:', ICON_ID, e);
                }
            };

            img.onerror = (e) => {
                loadingRef.current = false;
                console.warn('ship_live icon load failed:', e);
            };

            img.src = '/ship_live.png';
            imgRef.current = img;
        };

        const onStyleImageMissing = (e) => {
            if (e?.id !== ICON_ID) return;
            addIconIfNeeded();
        };

        const ensure = () => {
            if (!map.getStyle || !map.getStyle()) return;

            // 1) 아이콘 보장
            addIconIfNeeded();

            // 2) 소스 보장
            if (!map.getSource(SOURCE_ID)) {
                map.addSource(SOURCE_ID, {
                    type: 'geojson',
                    data: wfsUrl + '&_t=' + Date.now()
                });
            }

            // 3) 레이어 보장
            if (!map.getLayer(LAYER_ID)) {
                map.addLayer({
                    id: LAYER_ID,
                    type: 'symbol',
                    source: SOURCE_ID,
                    layout: {
                        'icon-image': ICON_ID,
                        'icon-size': 0.8,
                        'icon-allow-overlap': true
                    }
                });
            }

            // 4) z-order: places-label이 있으면 그 아래에
            if (map.getLayer('places-label')) map.moveLayer(LAYER_ID, 'places-label');
            else map.moveLayer(LAYER_ID);

            // 5) interval 1회만
            if (!intervalRef.current) {
                intervalRef.current = setInterval(() => {
                    const src = map.getSource(SOURCE_ID);
                    if (src && typeof src.setData === 'function') {
                        src.setData(wfsUrl + '&_t=' + Date.now());
                    }
                }, 1000);
            }
        };

        const { schedule, cleanup } = makeScheduledEnsure(map, ensure);

        // 초기 1회
        if (map.isStyleLoaded()) ensure();

        map.on('styledata', schedule);

        map.on('styleimagemissing', onStyleImageMissing);

        return () => {
            map.off('styledata', schedule);
            map.off('styleimagemissing', onStyleImageMissing);
            cleanup();

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            loadingRef.current = false;
        };
    }, [map]);

    return null;
}

export default LiveShipsLayer;
