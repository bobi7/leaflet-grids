/*
 *
 * Inspired by Leaflet.Grid: https://github.com/jieter/Leaflet.Grid
 */

L.Grids = L.LayerGroup.extend({
    options: {
        redraw: 'move',
        lineStyle: {
            stroke: true,
            color: '#111',
            opacity: 0.6,
            weight: 1,
            clickable: false
        },
        zoneStyle: {
                stroke: true,
                color: '#333',
                opacity: 0.6,
                weight: 3,
                clickable: false
        },
    },

    initialize: function (options) {
        L.LayerGroup.prototype.initialize.call(this);
        L.Util.setOptions(this, options);
    },


    onAdd: function (map) {
        this._map = map;
        var grid = this.redraw();
        this._map.on('viewreset ' + this.options.redraw, function () {
            grid.redraw();
        });
        this.eachLayer(map.addLayer, this);
    },

    redraw: function () {
        this._lngCoords = [],
        this._latCoords = [],
        this._mapZoom = this._map.getZoom();
        this._bounds =  this._map.getBounds().pad(0.5);
        this._gridSize = this._gridSpacing();
        this.eachLayer(this.removeLayer, this);
        var gridLines = this._gridLines();
        for (i in gridLines){
            this.addLayer(gridLines[i]);
                    }
        /*
        var labels = this._gridLabels();
        for (i in labels) {
            this.addLayer(labels[i]);
        }
        */
        return this;
    },
    
    _gridSpacing: function () {
        var zoom = this._map.getZoom();
        if (zoom > 18) {zoom = 18}
        return this.options.coordinateGridSpacing[zoom];
    },
        

    _gridLines: function () {
        var lines = [];
        var latCoord = this._snap(this._bounds.getSouth());
        var northBound = this._bounds.getNorth();
        while (latCoord < northBound) {
            this._latCoords.push(latCoord);
            latCoord += this._gridSize;
        }
        var lngCoord = this._snap(this._bounds.getWest());
        var eastBound = this._bounds.getEast();
        while (lngCoord < eastBound) {
            this._lngCoords.push(lngCoord);
            lngCoord += this._gridSize;
        }
        for (i in this._lngCoords) {
            lines.push(this._verticalLine(this._lngCoords[i]));
        }
        for (i in this._latCoords) {
            lines.push(this._horizontalLine(this._latCoords[i]));
        }
        return lines;
                },

    _gridLabels: function () {
        var labels = [];
        var bounds = this._map.getBounds().pad(-0.005);
        for (i in this._lngCoords) {
            latlng = L.latLng(bounds.getNorth(), this._lngCoords[1]) 
            labels.push(this._label(latlng));
        }
        for (i in this._latCoords) {
            latlng = L.latLng(bounds.getWest(), this._latCoords[1]) 
            labels.push(this._label(latlng));
        }
        return labels;
    },

    _snap: function (num) {
        return Math.floor(num / this._gridSize) * this._gridSize;
    },

    _snapTo: function (num, snap) {
        return Math.floor(num / snap) * snap;
    },

    _verticalLine: function (lng, options) {
                       console.log(options);
        return L.polyline([
                [this._bounds.getNorth(), lng],
                [this._bounds.getSouth(), lng]
            ], options ? options : this.options.lineStyle);
    },

    _horizontalLine: function (lat, options) {
        return L.polyline([
                [lat, this._bounds.getWest()],
                [lat, this._bounds.getEast()]
            ], options ? options : this.options.lineStyle);
    },

    _label: function (latlng) {
        //TODO figure out formatting
        return L.marker(latlng, {
                icon: L.divIcon({
                    iconSize: [0, 0],
                    className: 'leaflet-grid-label',
                    //html: '<div class="' + axis + '">' + this.formatCoord(num, axis) + '</div>'
                    html: '<div class="todo  ">' + 'label'+ '</div>'
                })
        });
    }
    

});

L.grids = {};



/*
  DECIMAL DEGREE GRIDS
 */
L.Grids.DD = L.Grids.extend({
    options: {
        coordinateGridSpacing: [
            20.0, // 0
            20.0, // 1
            20.0, // 2
            10.0, // 3
            5.0, // 4
            5.0, // 5
            2.0, // 6
            1.0, // 7
            1.0, // 8
            0.5, // 9
            0.25, // 10
            0.10, // 11
            0.05, // 12
            0.05, // 13
            0.01, // 14
            0.01, // 15
            0.01, // 16
            0.01, // 17
            0.01, // 18
        ],
        coordinateTemplate: '{degAbs}&deg;&nbsp;{minDec}\'{dir}'
    }


});

L.grids.dd = function (options) {
    return new L.Grids.DD(options);
};


/*
  DEGREE-MINUTE-SECONDS GRIDS
 */

L.Grids.DMS = L.Grids.extend({
    options: {
        coordinateGridSpacing: [
            20.0, // 0
            20.0, // 1
            20.0, // 2
            10.0, // 3
            5.0, // 4
            5.0, // 5
            2.0, // 6
            1.0, // 7
            1.0, // 8
            0.5, // 9
            0.25, // 10
            (1.0 / 60.0) * 5.0, // 11
            (1.0 / 60.0) * 3.0, // 12
            (1.0 / 60.0) * 2.0, // 13
            (1.0 / 60.0), // 14
            (1.0 / 120.0), // 15
            (1.0 / 120.0), // 16
            (1.0 / 240.0), // 17
            (1.0 / 240.0), // 18
        ],
        coordinateTemplate: '{degAbs}{dir}{min}\'{sec}"'
             },

});

L.grids.dms = function (options) {
    return new L.Grids.DMS(options);
};


/*
  UTM GRIDS
 */

L.Grids.UTM = L.Grids.extend({
    options: {
        coordinateGridSpacing: [
            1000000, // 0
            1000000, // 1
            1000000, // 2
            1000000, // 3
            1000000, // 4
            1000000, // 5
            1000000, // 6
            100000, // 7
            100000, // 8
            100000, // 9
            10000, // 10
            10000, // 11
            10000, // 12
            10000, // 13
            1000, // 14
            1000, // 15
            1000, // 16
            1000, // 17
            100, // 18
        ]
    },

    _gridLines: function () {
        var lines = [];
        if (this._map.getZoom() <= 8) {return []};
        var gridSize = this._gridSize;
        var southEastLL = this._bounds.getSouthEast();
        var northWestLL = this._bounds.getNorthWest();
        var southEast = mgrs.LLtoUTM({lon:southEastLL.lng, lat:southEastLL.lat});
        var northWest = mgrs.LLtoUTM({lon:northWestLL.lng, lat:northWestLL.lat});
        var latCoord = this._snap(southEast.northing);
        // draw horizontal lines
        while (latCoord < northWest.northing) {
            latCoord += gridSize;
            var leftPointUTM = {
                northing: latCoord,
                easting: northWest.easting,
                zoneLetter: northWest.zoneLetter,
                zoneNumber: northWest.zoneNumber
            };
            var leftPointLL = mgrs.UTMtoLL(leftPointUTM);
            var rightPointUTM = {
                northing: latCoord,
                easting: southEast.easting,
                zoneLetter: southEast.zoneLetter,
                zoneNumber: southEast.zoneNumber
            };
            var rightPointLL = mgrs.UTMtoLL(rightPointUTM);
            lines.push(L.polyline([leftPointLL,rightPointLL], this.options.lineStyle));
        }
        var lonCoord = this._snap(northWest.easting);
        // draw vertical lines from the middle out
        var mapCenterLL = this._map.getCenter();
        var mapCenterUTM = mgrs.LLtoUTM({lon:mapCenterLL.lng, lat:mapCenterLL.lat});
        var lonCoordCenter = this._snap(mapCenterUTM.easting);
        var lonCoordLeft = lonCoordCenter;
        var lonCoordRight = lonCoordCenter;
        var centerZone = mapCenterUTM.zoneLetter;
        var centerNumber = mapCenterUTM.zoneNumber;
        // draw the center line
        var bottomPointUTM = {
            northing: southEast.northing,
            easting: lonCoordCenter,
            zoneLetter: centerZone,
            zoneNumber: centerNumber
        };
        var bottomPointLL = mgrs.UTMtoLL(bottomPointUTM);
        var topPointUTM = {
            northing: northWest.northing,
            easting: lonCoordCenter,
            zoneLetter: centerZone,
            zoneNumber: centerNumber
        };
        var topPointLL = mgrs.UTMtoLL(topPointUTM);
        lines.push(L.polyline([bottomPointLL,topPointLL], this.options.lineStyle));
        // draw the other lines
        while (
                (lonCoordRight < southEast.easting) ||
                (lonCoordLeft > northWest.easting) 
              ){
            lonCoordRight += gridSize;
            lonCoordLeft -= gridSize;
            var coords = [lonCoordLeft, lonCoordRight];
            for (var i = 0; i < 2; i++){
                var bottomPointUTM = {
                    northing: southEast.northing,
                    easting: coords[i],
                    zoneLetter: centerZone,
                    zoneNumber: centerNumber
                };
                var bottomPointLL = mgrs.UTMtoLL(bottomPointUTM);
                var topPointUTM = {
                    northing: northWest.northing,
                    easting: coords[i],
                    zoneLetter: centerZone,
                    zoneNumber: centerNumber
                };
                var topPointLL = mgrs.UTMtoLL(topPointUTM);
                lines.push(L.polyline([bottomPointLL,topPointLL], this.options.lineStyle));
            }
        }
        return lines;
                },
});

L.grids.utm = function (options) {
    return new L.Grids.UTM(options);
};

/*
  MILITARY GRID REFERENCE SYSTEM GRIDS
 */

L.Grids.MGRS = L.Grids.extend({
    options: {
             },
    _gridSpacing: function () {
        if ( this._mapZoom < 10) {
            return 100000;
        };
        if ( this._mapZoom < 15 ) {
            return 10000;
        };
        if ( this._mapZoom < 18 ) {
            return 1000;
        };
        return NaN;
    },
    _gridLines: function () {
        var lines = [];
        console.log("ZOOM" + this._mapZoom);

        // 6 x 8 grid-zone lines

        var latCoord = this._snapTo(this._bounds.getSouth(), 8.0);
        var northBound = this._bounds.getNorth();
        var southBound = this._bounds.getSouth();
        var eastBound = this._bounds.getEast();
        var westBound = this._bounds.getWest();
        while (latCoord < northBound) {
            this._latCoords.push(latCoord);
            latCoord += 8.0;
        }
        var zoneBreaks = [westBound];
        var lngCoord = this._snapTo(westBound, 6.0);
        while (lngCoord < eastBound - 6.0) {
            this._lngCoords.push(lngCoord);
            lngCoord += 6.0;
            zoneBreaks.push(lngCoord);
        }
        zoneBreaks.push(eastBound);
        console.log("BREAKS: ", zoneBreaks);

        for (i in this._lngCoords) {
            lines.push(this._verticalLine(this._lngCoords[i], this.options.zoneStyle));
        }
        for (i in this._latCoords) {
            lines.push(this._horizontalLine(this._latCoords[i], this.options.zoneStyle));
        }
        if ( this._mapZoom < 8 ) {
            return lines;
        };
        // utm grids for all other zooms
        var gridSize = this._gridSize;
        var fFactor = .0001; // keeps calculations at zone boundaries inside the zone
        for (var i=0; i < zoneBreaks.length-1; i++) {
            var northWestLL = L.latLng( northBound, zoneBreaks[i] + fFactor );
            var southEastLL = L.latLng( southBound, zoneBreaks[i+1] - fFactor );
            var southEast = mgrs.LLtoUTM({lon:southEastLL.lng, lat:southEastLL.lat});
            var northWest = mgrs.LLtoUTM({lon:northWestLL.lng, lat:northWestLL.lat});
            var latCoord = this._snap(southEast.northing);
            // draw horizontal lines
            while (latCoord < northWest.northing ) {
                latCoord += gridSize;
                var leftPointUTM = {
                    northing: latCoord,
                    easting: northWest.easting,
                    zoneLetter: northWest.zoneLetter,
                    zoneNumber: northWest.zoneNumber
                };
                var leftPointLL = mgrs.UTMtoLL(leftPointUTM);
                var rightPointUTM = {
                    northing: latCoord,
                    easting: southEast.easting,
                    zoneLetter: southEast.zoneLetter,
                    zoneNumber: southEast.zoneNumber
                };
                var rightPointLL = mgrs.UTMtoLL(rightPointUTM);
                lines.push( this._cleanHorz(L.polyline([leftPointLL,rightPointLL], this.options.lineStyle), zoneBreaks[i],zoneBreaks[i+1]));
            }
            // draw vertical lines
            var lonCoord = this._snap(northWest.easting - gridSize);
            while (lonCoord < southEast.easting){
                lonCoord += gridSize;
                var bottomPointUTM = {
                    northing: southEast.northing,
                    easting: lonCoord,
                    zoneLetter: southEast.zoneLetter,
                    zoneNumber: southEast.zoneNumber
                };
                var bottomPointLL = mgrs.UTMtoLL(bottomPointUTM);
                var topPointUTM = {
                    northing: northWest.northing,
                    easting: lonCoord,
                    zoneLetter: northWest.zoneLetter,
                    zoneNumber: northWest.zoneNumber
                };
                var topPointLL = mgrs.UTMtoLL(topPointUTM);
                lines.push( this._cleanVert(L.polyline([bottomPointLL,topPointLL], this.options.lineStyle), zoneBreaks[i], zoneBreaks[i+1]));
            }

        }
        return lines;

    },
    _gridLabels: function () {
        var labels = [];
        // for each _horizontalLine
        // and for each verticalLine
        // push a label
        return labels;
    },
    _cleanHorz: function (line, leftLng, rightLng) {
       var pts = line.getLatLngs(); 
       var options = line.options;
       var cleanLine;
       var pt1 = pts[0];
       var pt2 = pts[pts.length-1];
       var slope = (pt1.lat-pt2.lat)/(pt1.lng-pt2.lng);
       // Right side
       var newRightLat = pt1.lat - (slope * (leftLng - pt2.lng));
       var newPt2 = L.latLng(newRightLat,rightLng);
       // Left side
       var newLeftLat = pt2.lat + (slope * (pt1.lng - rightLng));
       var newPt1 = L.latLng(newLeftLat,leftLng);

       var cleanLine = L.polyline([newPt1, newPt2], options);

       return cleanLine;
    },

    _cleanVert: function (line, leftLng, rightLng) {
       var pts = line.getLatLngs(); 
       var options = line.options;
       var pt1 = pts[0];
       var pt2 = pts[pts.length-1];
       var slope = (pt1.lat-pt2.lat)/(pt1.lng-pt2.lng);
       if ( pt2.lng > rightLng) {
           var newLat = pt1.lat + (slope * (rightLng - pt1.lng));
           pt2 = L.latLng(newLat,rightLng);
       } 
       if ( pt2.lng < leftLng) {
           var newLat = pt1.lat + (slope * (leftLng - pt1.lng));
           pt2 = L.latLng(newLat,leftLng);
       } 
       return L.polyline([pt1, pt2], options);
    }

});

L.grids.mgrs = function (options) {
    return new L.Grids.MGRS(options);
};


/*
  DISTANCE GRIDS
 */

L.Grids.Distance = L.Grids.extend({

    _gridSpacing: function() {
        var zoom = this._map.getZoom();
        var lat = this._map.getCenter().lat;
        if (Math.abs(lat) > 55) {zoom += 1;}
        if (zoom > 18) {zoom = 18;}
        this.gridLabel = this.options.gridSpacingLabel[zoom];
        return this.options.coordinateGridSpacing[zoom];
    },

    _gridLines: function () {
        var lines = [];
        var zoom = this._map.getZoom();
        var metersAtEquator = metersPerPixel(0, zoom);
        var metersAtLat = metersPerPixel(this._map.getCenter().lat, zoom);
        var gridSize = this._gridSize * metersAtEquator / metersAtLat;
        console.log(this.gridLabel);
        var latCoord = LLtoSM(this._map.getCenter()).y;
        var latCoordUp = latCoord;
        var latCoordDown = latCoord;
        var eastBound = LLtoSM(this._bounds.getSouthEast()).x;
        var westBound = LLtoSM(this._bounds.getSouthWest()).x;
        var northBound = LLtoSM(this._bounds.getNorthWest()).y;
        var southBound = LLtoSM(this._bounds.getSouthWest()).y;
        // draw center horizontal line
        var leftPointCenter = SMtoLL(L.point(westBound,latCoord));
        var rightPointCenter = SMtoLL(L.point(eastBound,latCoord));
        lines.push( L.polyline([leftPointCenter,rightPointCenter], this.options.lineStyle));
        // draw horizontal lines from center out
        while (latCoordUp < northBound) {
            latCoordUp += gridSize;
            latCoordDown -= gridSize;
            var latCoords = [latCoordUp, latCoordDown];
            for ( var i = 0; i < 2; i++) {
                var leftPoint = SMtoLL(L.point(westBound,latCoords[i]));
                var rightPoint = SMtoLL(L.point(eastBound,latCoords[i]));
                lines.push( L.polyline([leftPoint,rightPoint], this.options.lineStyle));
            }
        }
        // draw center vertical line
        var lngCoord = LLtoSM(this._bounds.getCenter()).x;
        var lngCoordRight = lngCoord;
        var lngCoordLeft = lngCoord;
        var topPointCenter = SMtoLL(L.point(lngCoord,northBound));
        var bottomPointCenter = SMtoLL(L.point(lngCoord,southBound));
        lines.push(L.polyline([topPointCenter,bottomPointCenter], this.options.lineStyle));
        // draw vertical lines from center out
        while (lngCoordRight < eastBound) {
            lngCoordRight += gridSize;
            lngCoordLeft -= gridSize;
            var lngCoords = [lngCoordLeft, lngCoordRight];
            for ( var i = 0; i < 2; i++ ) {
                var topPoint = SMtoLL(L.point(lngCoords[i], northBound));
                var bottomPoint = SMtoLL(L.point(lngCoords[i], southBound));
                lines.push(L.polyline([topPoint, bottomPoint], this.options.lineStyle));
            }
        }
        return lines;
                },


});

L.grids.distance = {};

L.Grids.Distance.Metric = L.Grids.Distance.extend({
    options: {
        coordinateGridSpacing: [
            25000000, // 0
            10000000, // 1
            5000000, // 2
            2500000, // 3
            1000000, // 4
            500000, // 5
            250000, // 6
            100000, // 7
            50000, // 8
            25000, // 9
            10000, // 10
            5000, // 11
            2500, // 12
            1000, // 13
            500, // 14
            250, // 15
            100, // 16
            50, // 17
            25 // 18
            ],
        gridSpacingLabel: [
            "250,000 km", // 0 
            "100,000 km", // 1
            "50,000 km", // 2
            "25,000 km", // 3
            "10,000 km", // 4
            "5000 km", // 5
            "2500 km", // 6
            "100 km", // 7
            "50 km", // 8
            "25 km", // 9
            "10 km", // 10
            "5 km", // 11
            "2.5 km", // 12
            "1 km", // 13
            "500 m", // 14
            "250 m", // 15
            "100 m", // 16
            "50 m", // 17
            "10 m", // 18
             ]

        },
});

L.grids.distance.metric = function (options) {
    return new L.Grids.Distance.Metric(options);
};


L.Grids.Distance.Imperial = L.Grids.Distance.extend({
    options: {
        coordinateGridSpacing: [
            10000*5280/3.28, // 0
            5000*5280/3.28, // 1
            2500*5280/3.28, // 2
            1000*5280/3.28, // 3
            500*5280/3.28, // 4
            250*5280/3.28, // 5
            100*5280/3.28, // 6
            50*5280/3.28, // 7
            25*5280/3.28, // 8
            10*5280/3.28, // 9
            5*5280/3.28, // 10
            2.5*5280/3.28, // 11
            1*5280/3.28, // 12
            2500/3.28, // 13
            1000/3.28, // 14
            500/3.28, // 15
            250/3.28, // 16
            100/3.28, // 17
            50/3.28 // 18
            ],
        gridSpacingLabel: [
            "10000 mi", // 0
            "5000 mi", // 1
            "2500 mi", // 2
            "1000 mi", // 3
            "500 mi", // 4
            "250 mi", // 5
            "100 mi", // 6
            "50 mi", // 7
            "25 mi", // 8
            "10 mi", // 9
            "5 mi", // 10
            "2.5 mi", // 11
            "1 mi", // 12
            "2500 ft", // 13
            "1000 ft", // 14
            "500 ft", // 15
            "250 ft", // 16
            "100 ft ", // 17
            "50 ft", // 18
             ]
        }

});

L.grids.distance.imperial = function (options) {
    return new L.Grids.Distance.Imperial(options);
};

// per  http://stackoverflow.com/questions/17664327/leaflet-panto-web-mercator-coordinates-epsg-3857
// and https://en.wikipedia.org/wiki/Earth_radius#Mean_radius

var EARTH_RADIUS = 6371000;

SMtoLL = function (point) { // Spherical Mercator -> LatLng
    projectionPoint = L.point(point).divideBy(EARTH_RADIUS);
    return L.Projection.SphericalMercator.unproject(projectionPoint);

};

LLtoSM = function (point) { // LatLng -> Spherical Mercator 
    return L.Projection.SphericalMercator.project(point).multiplyBy(EARTH_RADIUS);

};

// per http://stackoverflow.com/questions/27545098/leaflet-calculating-meters-per-pixel-at-zoom-level/31266377#31266377

metersPerPixel = function (lat,zoom) {
   return EARTH_RADIUS * Math.abs(Math.cos(lat / 180 * Math.PI)) / Math.pow(2, zoom+8);
};
