import * as shapefile from 'shapefile';

/**
 * Shapefile 세트(.shp + .dbf + .shx)를 GeoJSON으로 변환
 */
export async function parseShapefileSet(files) {
    try {

        const shpBuffer = await files.shp.arrayBuffer();
        const dbfBuffer = await files.dbf.arrayBuffer();

        const geojson = await shapefile.read(shpBuffer, dbfBuffer);

        if (!geojson || !geojson.features || geojson.features.length === 0) {
            throw new Error('Shapefile에 유효한 Feature가 없습니다.');
        }

        return geojson;

    } catch (error) {
        throw new Error(`Shapefile 파싱 오류: ${error.message}`);
    }
}