export const basemaps = {
    GEBCO: {
        tiles: [
            '/geoserver/ocean/wms?' +
            'service=WMS&request=GetMap&version=1.1.1&' +
            'layers=ocean:gebco_mosaic&' +
            'styles=&bbox={bbox-epsg-3857}&' +
            'width=256&height=256&srs=EPSG:3857&format=image/png&transparent=false'
        ]
    },
    ETOPO: {
        tiles: [
        /*
            '/geoserver/ocean/wms?' +
            'service=WMS&request=GetMap&version=1.1.1&' +
            'layers=ocean:etopo2022_30s&' +
            'styles=&bbox={bbox-epsg-3857}&' +
            'width=256&height=256&srs=EPSG:3857&format=image/png&transparent=false'
        */
            '/geoserver/gwc/service/wmts?' +
            'SERVICE=WMTS&' +
            'REQUEST=GetTile&' +
            'VERSION=1.0.0&' +
            'LAYER=ocean:ETOPO_ice_surface_elevation_15s&' +
            'STYLE=&' +
            'TILEMATRIXSET=EPSG:900913&' +
            'TILEMATRIX=EPSG:900913:{z}&' +
            'TILEROW={y}&' +
            'TILECOL={x}&' +
            'FORMAT=image/jpeg'
        ]
    }
};
