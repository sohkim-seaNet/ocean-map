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
            '/geoserver/ocean/wms?' +
            'service=WMS&request=GetMap&version=1.1.1&' +
            'layers=ocean:etopo2022_30s&' +
            'styles=&bbox={bbox-epsg-3857}&' +
            'width=256&height=256&srs=EPSG:3857&format=image/png&transparent=false'
        ]
    }
};
