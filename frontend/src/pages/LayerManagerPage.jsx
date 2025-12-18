// src/pages/LayerManagerPage.jsx

function LayerManagerPage() {
    return (
        <div className="h-full flex">
            {/* 좌측: 레이어 목록 + 파일 업로드 영역 */}
            <aside className="w-80 bg-white border-r border-gray-300 flex flex-col">
                {/* 헤더 */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800">레이어 관리</h2>
                    <p className="text-sm text-gray-600 mt-1">파일을 추가하고 레이어를 관리하세요</p>
                </div>

                {/* 레이어 목록 */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">레이어 목록</h3>

                        {/* 임시 레이어 아이템 */}
                        <div className="space-y-2">
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                                        <span className="text-sm font-medium">기본 지도</span>
                                    </div>
                                    <button className="text-red-500 hover:text-red-700 text-sm">삭제</button>
                                </div>
                            </div>
                        </div>

                        {/* 레이어가 없을 때 */}
                        <div className="text-center py-8 text-gray-400">
                            <p className="text-sm">레이어가 없습니다</p>
                            <p className="text-xs mt-1">아래에서 파일을 추가하세요</p>
                        </div>
                    </div>
                </div>

                {/* 드래그앤드롭 영역 */}
                <div className="p-4 border-t border-gray-200">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                        <div className="text-gray-400 mb-2">
                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-700">파일을 드래그하거나 클릭</p>
                        <p className="text-xs text-gray-500 mt-1">
                            GeoJSON, KML, Shapefile, GeoTIFF
                        </p>
                    </div>
                </div>
            </aside>

            {/* 우측: 지도 미리보기 */}
            <main className="flex-1 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700">지도 미리보기</h3>
                    <p className="text-gray-500 mt-2">레이어를 추가하면 여기에 표시됩니다</p>
                </div>
            </main>
        </div>
    );
}

export default LayerManagerPage;