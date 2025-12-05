import { useEffect } from 'react';
import { useMap } from '../contexts/MapContext';

function LiveShipsLayer() {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const wfsUrl =
            '/geoserver/ocean/ows?' +
            'service=WFS&version=1.0.0&request=GetFeature&' +
            'typeName=ocean:ships_current&' +
            'outputFormat=application/json';

        let intervalId;

        /**
         * 맵 로드 완료 후 실행되는 초기화 함수
         */
        const onLoad = () => {
            // 1. 선박 아이콘 이미지 로드
            const img = new Image();
            img.onload = () => {
                if (!map.hasImage('ship-live-icon')) {
                    map.addImage('ship-live-icon', img);
                }

                // 2. GeoJSON 소스 추가
                if (!map.getSource('ships-current')) {
                    map.addSource('ships-current', {
                        type: 'geojson',
                        data: wfsUrl + '&_t=' + Date.now()
                    });
                }

                // 3. Symbol 레이어 추가
                if (!map.getLayer('ships-current-layer')) {
                    map.addLayer({
                        id: 'ships-current-layer',
                        type: 'symbol',
                        source: 'ships-current',
                        layout: {
                            'icon-image': 'ship-live-icon',
                            'icon-size': 0.8,
                            'icon-allow-overlap': true
                        }
                    });
                }

                // 4. 실시간 데이터 갱신 인터벌 설정
                intervalId = setInterval(() => {
                    const src = map.getSource('ships-current');
                    if (src) {
                        src.setData(wfsUrl + '&_t=' + Date.now());
                    }
                }, 1000);
            };

            img.onerror = (err) => console.error('이미지 로드 실패:', err);
            img.src = '/ship_live.png';
        };

        if (map.isStyleLoaded()) {
            onLoad();
        } else {
            map.on('load', onLoad);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
            if (map.off) map.off('load', onLoad);
        };
    }, [map]);

    return null;
}

export default LiveShipsLayer;
