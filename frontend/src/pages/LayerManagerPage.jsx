import { useState } from 'react';
import FileDropZone from '../components/map/layerManager/FileDropZone';
import LayerPreview from '../components/map/layerManager/LayerPreview';
import { parseFile } from '../components/map/layerManager/fileParser';
import { parseShapefileSet } from '../components/map/layerManager/shapefileHelper';

function LayerManagerPage() {
    const [layers, setLayers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFilesAdded = async (files) => {
        setIsLoading(true);

        console.log('업로드된 파일:', files.map(f => f.name));

        // Shapefile 관련 파일 찾기
        const shpFiles = files.filter(f => f.name.toLowerCase().endsWith('.shp'));
        const shapefileRelated = files.filter(f => {
            const lower = f.name.toLowerCase();
            return lower.endsWith('.shp') ||
                lower.endsWith('.dbf') ||
                lower.endsWith('.shx') ||
                lower.endsWith('.prj') ||
                lower.endsWith('.qix');
        });

        // 일반 파일 (GeoJSON, KML, KMZ, GeoTIFF)
        const otherFiles = files.filter(f => {
            const lower = f.name.toLowerCase();
            return !lower.endsWith('.shp') &&
                !lower.endsWith('.dbf') &&
                !lower.endsWith('.shx') &&
                !lower.endsWith('.prj') &&
                !lower.endsWith('.qix');
        });

        console.log('Shapefile 관련:', shapefileRelated.map(f => f.name));
        console.log('일반 파일:', otherFiles.map(f => f.name));

        // 1. Shapefile 세트 처리
        for (const shpFile of shpFiles) {
            try {
                // 확장자 제거
                const baseName = shpFile.name.slice(0, -4); // .shp 제거


                // 모든 파일(files)에서 찾기 (shapefileRelated 아님!)
                const dbfFile = files.find(f => {
                    const fBaseName = f.name.slice(0, -4); // 확장자 제거
                    const fExt = f.name.slice(-4).toLowerCase();
                    return fBaseName === baseName && fExt === '.dbf';
                });

                const shxFile = files.find(f => {
                    const fBaseName = f.name.slice(0, -4);
                    const fExt = f.name.slice(-4).toLowerCase();
                    return fBaseName === baseName && fExt === '.shx';
                });

                const prjFile = files.find(f => {
                    const fBaseName = f.name.slice(0, -4);
                    const fExt = f.name.slice(-4).toLowerCase();
                    return fBaseName === baseName && fExt === '.prj';
                });

                if (!dbfFile) {
                    alert(`❌ ${shpFile.name}\n\n.dbf 파일을 찾을 수 없습니다.\n\nShapefile은 최소 3개의 파일이 필요합니다:\n• ${baseName}.shp\n• ${baseName}.dbf ← 필수!\n• ${baseName}.shx\n\n모든 파일을 함께 드래그해주세요.`);
                    continue;
                }

                // Shapefile 세트 파싱
                const data = await parseShapefileSet({
                    shp: shpFile,
                    dbf: dbfFile,
                    shx: shxFile,
                    prj: prjFile
                });

                const newLayer = {
                    id: Date.now() + Math.random(),
                    name: shpFile.name,
                    size: shpFile.size,
                    type: 'shp',
                    data: data,
                    visible: true
                };

                setLayers(prev => [...prev, newLayer]);

            } catch (error) {
                alert(`❌ ${shpFile.name}\n\n${error.message}`);
            }
        }

        // 2. 일반 파일 처리
        for (const file of otherFiles) {
            try {
                const data = await parseFile(file);

                const newLayer = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.name.split('.').pop().toLowerCase(),
                    data: data,
                    visible: true
                };

                setLayers(prev => [...prev, newLayer]);

            } catch (error) {
                alert(`❌ ${file.name}\n\n${error.message}`);
            }
        }

        setIsLoading(false);
    };

    const handleRemoveLayer = (id) => {
        setLayers(prev => prev.filter(l => l.id !== id));
    };

    const handleToggleVisibility = (id) => {
        setLayers(prev => prev.map(layer =>
            layer.id === id ? { ...layer, visible: !layer.visible } : layer
        ));
    };

    return (
        <div className="h-full flex">
            {/* 좌측: 레이어 목록 */}
            <aside className="w-80 bg-white border-r border-gray-300 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800">레이어 관리</h2>
                    <p className="text-sm text-gray-600 mt-1">파일을 추가하고 레이어를 관리하세요</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                            레이어 목록 ({layers.length})
                        </h3>

                        {isLoading && (
                            <div className="text-center py-4">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <p className="text-sm text-gray-600 mt-2">파일 처리 중...</p>
                            </div>
                        )}

                        {layers.length > 0 ? (
                            <div className="space-y-2">
                                {layers.map(layer => (
                                    <div
                                        key={layer.id}
                                        className="p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <input
                                                    type="checkbox"
                                                    checked={layer.visible}
                                                    onChange={() => handleToggleVisibility(layer.id)}
                                                    className="w-4 h-4 flex-shrink-0"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-800 truncate">
                                                        {layer.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {layer.type.toUpperCase()} • {(layer.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveLayer(layer.id)}
                                                className="text-red-500 hover:text-red-700 text-sm ml-2 flex-shrink-0"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : !isLoading && (
                            <div className="text-center py-8 text-gray-400">
                                <p className="text-sm">레이어가 없습니다</p>
                                <p className="text-xs mt-1">아래에서 파일을 추가하세요</p>
                            </div>
                        )}
                    </div>
                </div>

                <FileDropZone onFilesAdded={handleFilesAdded} />
            </aside>

            {/* 우측: 지도 미리보기 */}
            <main className="flex-1 relative">
                {layers.length > 0 ? (
                    <LayerPreview layers={layers} />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700">지도 미리보기</h3>
                            <p className="text-gray-500 mt-2">GeoJSON 또는 Shapefile을 추가하면 여기에 표시됩니다</p>

                            {/* 안내 메시지 추가 */}
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                                <p className="text-sm text-blue-800 font-semibold mb-2">💡 Shapefile 업로드 방법</p>
                                <p className="text-xs text-blue-700 text-left">
                                    Shapefile은 여러 파일로 구성됩니다.<br/>
                                    <strong>3개 파일을 함께</strong> 드래그앤드롭 하세요:<br/>
                                    <br/>
                                    • <code className="bg-blue-100 px-1 rounded">파일명.shp</code> - 도형 데이터<br/>
                                    • <code className="bg-blue-100 px-1 rounded">파일명.dbf</code> - 속성 테이블 (필수!)<br/>
                                    • <code className="bg-blue-100 px-1 rounded">파일명.shx</code> - 인덱스<br/>
                                    <br/>
                                    <span className="text-gray-600">(.prj 파일도 있으면 함께 업로드)</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default LayerManagerPage;
