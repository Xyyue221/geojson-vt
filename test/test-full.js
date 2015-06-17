'use strict';

var test = require('tape');
var fs = require('fs');
var path = require('path');
var genTiles = require('./gen-tiles');

testTiles('us-states.json', 'us-states-tiles.json', 7, 200);
testTiles('dateline.json', 'dateline-tiles.json');
testTiles('feature.json', 'feature-tiles.json');
testTiles('collection.json', 'collection-tiles.json');

test('throws on invalid GeoJSON', function (t) {
    t.throws(function () {
        genTiles({type: 'Pologon'});
    });
    t.end();
});

function testTiles(inputFile, expectedFile, maxZoom, maxPoints) {
    test('full tiling test: ' + inputFile, function (t) {
        var tiles = genTiles(getJSON(inputFile), maxZoom, maxPoints);
        t.same(tiles, getJSON(expectedFile));

        for (var i in tiles) {
            var tile = tiles[i];

            for (var j = 0; j < tile.length; j++) {
                var geom = tile[j].geometry;

                if (tile[j].type > 1) {
                    for (var m = 0; m < geom.length; m++) {
                        for (var n = 1; n < geom[m].length; n++) {
                            var p1 = geom[m][n - 1];
                            var p2 = geom[m][n];

                            t.ok(p1[0] !== p2[0] || p1[1] !== p2[0], p1 + ' ' + p2);
                        }
                    }
                }
            }
        }

        t.end();
    });
}

function getJSON(name) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '/fixtures/' + name)));
}
