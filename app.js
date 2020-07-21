var geojson = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

var earthquakeLayer = new L.LayerGroup();

var mapLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: "pk.eyJ1IjoibGJ1dHRvbiIsImEiOiJja2N3Y3ZhamYwYTM0MnpxcGt3b256eXo5In0.vU5gLoHRULsIU-6WakyIyw"
});

var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [mapLayer, earthquakeLayer]
});

d3.json(geojson, function(geojsonData) {
    function markerScale(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        else {
            return magnitude * 2;
        }
    }

    function geojsonMarkerOptions(magnitude) {
        return {
            radius: markerScale(feature.properties.mag),
            fillColor: "#ffffff",
            // fillColor: markerColor(feature.properties.mag),
            color: "#000000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }
    };

    L.geoJSON(geojsonData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        style: "style placeholder",
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Location: " + feature.properties.place +"\nMagnitude: " + feature.properties.mag)
        }

    }).addTo(earthquakeLayer);
    earthquakeLayer.addTo(map);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5];

        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magnitudes[i] + 1) + '"/> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(map);
});