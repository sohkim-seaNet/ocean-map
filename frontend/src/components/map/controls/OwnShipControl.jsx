import { useMap } from '../../../contexts/MapContext';

function OwnShipControl() {
    const map = useMap();

    const handleMoveToAraon = async () => {
        if (!map) return;

        const source = map.getSource('ships-current');

        if (!source) {
            alert('선박 레이어가 아직 준비되지 않았습니다.');
            return;
        }

        // GeoJSONSource.getData(): 소스의 실제 GeoJSON을 Promise로 반환
        const geojson = await source.getData();
        // features가 없으면 빈 배열로 대체
        const features = geojson?.features ?? [];

        if (features.length === 0) {
            alert('아라온호 위치 정보를 수신 중입니다.\n잠시 후 다시 시도해주세요.');
            return;
        }

        const feature = features[0];
        const coords = feature?.geometry?.coordinates;

        // 좌표 형식 검증:
        if (!Array.isArray(coords) || coords.length !== 2) {
            alert('선박 좌표 데이터 형식이 올바르지 않습니다.');
            return;
        }

        // MapLibre 카메라 이동
        map.flyTo({
            center: coords,
            zoom: 8,
            speed: 1.5,
        });
    };

    return (
        <div className="absolute top-[84px] right-4 z-10">
            <button
                type="button"
                onClick={handleMoveToAraon}
                className="px-2 py-1 bg-slate-800 text-white text-xs rounded flex items-center justify-center gap-1"
                title="아라온호 위치로 이동"
            >
                <span className="text-sm leading-none">🚢</span>
                <span>아라온</span>
            </button>
        </div>
    );
}

export default OwnShipControl;
