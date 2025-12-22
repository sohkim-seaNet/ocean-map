import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function LayerPreview({ layers }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const prevLayersRef = useRef([]);

    // 지도 초기화
    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    'raster-tiles': {
                        type: 'raster',
                        tiles: [
                            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                        ],
                        tileSize: 256
                    }
                },
                layers: [
                    {
                        id: 'background',
                        type: 'raster',
                        source: 'raster-tiles'
                    }
                ]
            },
            center: [127, 37],
            zoom: 5
        });

        map.on('load', () => {
            setMapLoaded(true);
        });

        mapRef.current = map;

        return () => {
            map.remove();
        };
    }, []);

    // 레이어 추가/업데이트
    useEffect(() => {
        const map = mapRef.current;

        if (!map || !mapLoaded) {
            return;
        }

        // 1. 이전에 있던 레이어 중 삭제된 레이어 찾기
        const prevLayers = prevLayersRef.current;
        const currentLayerIds = layers.map(l => l.id);
        const removedLayers = prevLayers.filter(prev =>
            !currentLayerIds.includes(prev.id)
        );

        // 2. 삭제된 레이어를 지도에서 제거
        removedLayers.forEach(removed => {
            const layerIndex = prevLayers.findIndex(l => l.id === removed.id);
            const layerId = `layer-${layerIndex}`;
            const outlineId = `${layerId}-outline`;

            if (map.getLayer(outlineId)) {
                map.removeLayer(outlineId);
            }
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
            if (map.getSource(layerId)) {
                map.removeSource(layerId);
            }
        });

        // 3. 모든 기존 레이어 제거 (재렌더링)
        prevLayers.forEach((layer, index) => {
            const layerId = `layer-${index}`;
            const outlineId = `${layerId}-outline`;

            if (map.getLayer(outlineId)) {
                map.removeLayer(outlineId);
            }
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
            if (map.getSource(layerId)) {
                map.removeSource(layerId);
            }
        });

        // 4. 현재 레이어들을 새로 추가
        const bounds = new maplibregl.LngLatBounds();
        let hasVisibleLayers = false;

        layers.forEach((layer, index) => {
            if (!layer.data || !layer.visible) return;

            const layerId = `layer-${index}`;

            try {
                // 벡터 레이어 처리만 남김 (GeoJSON, KML, Shapefile)
                map.addSource(layerId, {
                    type: 'geojson',
                    data: layer.data
                });

                // 레이어 타입에 따라 스타일 결정
                const geometryType = layer.data.type === 'FeatureCollection'
                    ? layer.data.features[0]?.geometry?.type
                    : layer.data.geometry?.type;

                if (geometryType === 'Point' || geometryType === 'MultiPoint') {
                    map.addLayer({
                        id: layerId,
                        type: 'circle',
                        source: layerId,
                        paint: {
                            'circle-radius': 8,
                            'circle-color': '#007cbf',
                            'circle-stroke-width': 2,
                            'circle-stroke-color': '#ffffff'
                        }
                    });
                } else if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
                    map.addLayer({
                        id: layerId,
                        type: 'line',
                        source: layerId,
                        paint: {
                            'line-color': '#ff0000',
                            'line-width': 3
                        }
                    });
                } else if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
                    map.addLayer({
                        id: layerId,
                        type: 'fill',
                        source: layerId,
                        paint: {
                            'fill-color': '#088',
                            'fill-opacity': 0.4
                        }
                    });
                    map.addLayer({
                        id: `${layerId}-outline`,
                        type: 'line',
                        source: layerId,
                        paint: {
                            'line-color': '#000',
                            'line-width': 2
                        }
                    });
                }

                // 벡터 레이어 bounds 추가
                const features = layer.data.type === 'FeatureCollection'
                    ? layer.data.features
                    : [layer.data];

                features.forEach(feature => {
                    if (!feature || !feature.geometry) return;

                    const coords = feature.geometry.coordinates;
                    const geomType = feature.geometry.type;

                    if (geomType === 'Point') {
                        bounds.extend(coords);
                    } else if (geomType === 'LineString') {
                        coords.forEach(coord => bounds.extend(coord));
                    } else if (geomType === 'Polygon') {
                        coords[0].forEach(coord => bounds.extend(coord));
                    }
                });

                hasVisibleLayers = true;

            } catch (error) {
                console.error('레이어 추가 실패:', error);
            }
        });

        // 5. 레이어가 있으면 자동 줌
        if (hasVisibleLayers && !bounds.isEmpty()) {
            map.fitBounds(bounds, { padding: 50 });
        }

        // 6. 현재 레이어 상태 저장
        prevLayersRef.current = [...layers];

    }, [layers, mapLoaded]);

    return (
        <div ref={mapContainer} className="w-full h-full" />
    );
}

export default LayerPreview;