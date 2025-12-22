// src/components/map/layerManager/FileDropZone.jsx

import { useState } from 'react';

function FileDropZone({ onFilesAdded }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);

        if (files.length === 0) {
            alert('파일이 선택되지 않았습니다.');
            return;
        }

        const validFiles = files.filter(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            // GeoJSON, KML, KMZ, Shapefile만
            return ['geojson', 'json', 'kml', 'kmz', 'shp', 'dbf', 'shx', 'prj', 'qix'].includes(ext);
        });

        if (validFiles.length > 0) {
            onFilesAdded(validFiles);
        } else {
            alert('지원하지 않는 파일 형식입니다.\n\n지원 형식: GeoJSON, KML, KMZ, Shapefile');
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 0) {
            onFilesAdded(files);
        }
    };

    const handleClick = () => {
        document.getElementById('file-input').click();
    };

    return (
        <div className="p-4 border-t border-gray-200">
            <input
                id="file-input"
                type="file"
                multiple
                accept=".geojson,.json,.kml,.kmz,.shp,.dbf,.shx,.prj"
                className="hidden"
                onChange={handleFileSelect}
            />

            {/* Shapefile 안내 배너 */}
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs font-semibold text-blue-800 mb-1">
                    📁 지원 파일 형식
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                    <li>• <strong>GeoJSON</strong> (.geojson, .json)</li>
                    <li>• <strong>KML/KMZ</strong> (.kml, .kmz)</li>
                    <li>• <strong>Shapefile</strong> (.shp + .dbf + .shx)</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2">
                    💡 Shapefile은 3개 파일을 함께 업로드하세요
                </p>
            </div>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`
                    border-2 border-dashed rounded-lg p-6 text-center 
                    transition-all cursor-pointer
                    ${ isDragging
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }
                `}
            >
                <div className={`mb-2 transition-colors ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}>
                    <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">
                    {isDragging ? '파일을 놓으세요' : '파일을 드래그하거나 클릭'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    GeoJSON • KML/KMZ • Shapefile
                </p>
            </div>
        </div>
    );
}

export default FileDropZone;
