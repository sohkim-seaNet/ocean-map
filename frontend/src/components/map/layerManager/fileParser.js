// src/components/map/layerManager/fileParser.js

import * as toGeoJSON from '@tmcw/togeojson';
import JSZip from 'jszip';

/**
 * 파일 타입에 따라 적절한 파서 호출
 */
export async function parseFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();

    try {
        switch (ext) {
            case 'geojson':
            case 'json':
                return await parseGeoJSON(file);

            case 'kml':
                return await parseKML(file);

            case 'kmz':
                return await parseKMZ(file);

            default:
                throw new Error(`지원하지 않는 파일 형식: ${ext}`);
        }
    } catch (error) {
        console.error('파일 파싱 오류:', error);
        throw new Error(`${file.name} 파싱 실패: ${error.message}`);
    }
}

/**
 * GeoJSON 파일 파싱
 */
async function parseGeoJSON(file) {
    const text = await file.text();
    const geojson = JSON.parse(text);

    if (!geojson.type) {
        throw new Error('유효하지 않은 GeoJSON 파일입니다.');
    }

    if (geojson.type !== 'Feature' && geojson.type !== 'FeatureCollection') {
        throw new Error('GeoJSON은 Feature 또는 FeatureCollection이어야 합니다.');
    }

    return geojson;
}

/**
 * KML 파일 파싱
 */
async function parseKML(file) {
    try {

        const text = await file.text();
        const parser = new DOMParser();
        const kml = parser.parseFromString(text, 'text/xml');

        // 파싱 에러 체크
        const parserError = kml.querySelector('parsererror');
        if (parserError) {
            throw new Error('KML 파일 파싱 오류');
        }

        // KML → GeoJSON 변환
        const geojson = toGeoJSON.kml(kml);

        if (!geojson.features || geojson.features.length === 0) {
            throw new Error('KML에 유효한 Feature가 없습니다.');
        }

        return geojson;

    } catch (error) {
        throw new Error(`KML 파싱 오류: ${error.message}`);
    }
}

/**
 * KMZ 파일 파싱 (압축된 KML)
 */
async function parseKMZ(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        // .kml 파일 찾기
        let kmlFile = null;
        zip.forEach((relativePath, zipEntry) => {
            if (relativePath.toLowerCase().endsWith('.kml') && !kmlFile) {
                kmlFile = zipEntry;
            }
        });

        if (!kmlFile) {
            throw new Error('KMZ 안에 KML 파일이 없습니다.');
        }

        // KML 텍스트 추출
        const kmlText = await kmlFile.async('text');

        // KML 파싱
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, 'text/xml');

        const geojson = toGeoJSON.kml(kml);

        if (!geojson.features || geojson.features.length === 0) {
            throw new Error('KMZ에 유효한 Feature가 없습니다.');
        }

        return geojson;

    } catch (error) {
        throw new Error(`KMZ 파싱 오류: ${error.message}`);
    }
}