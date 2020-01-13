// map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

// add tileLayer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

// function to select color based on earthquake magnitude
function cicleColor(mag) {
        return mag > 5 ? "#ff0800" :
           mag > 4 ? "#ff2c00" :
           mag > 3 ? "#ff5100" :
           mag > 2 ? "#ff7600" :
           mag > 1 ? "#ffe900" :
                     "#b6ff00"
};


var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data) {
    // console.log(data);
    console.log(data.features[0].properties);

    L.geoJson(data, {
        // covert points to circles
        pointToLayer: function (feature, latlng) {

            // circle properties
            var eqMarker = {
                radius: feature.properties.mag *5,
                fillColor: cicleColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.75
            };
            
            return L.circleMarker(latlng, eqMarker);
        },

        // add earthquake info on click
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +"</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        }
    }).addTo(myMap);

    // add legend
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            categories = [0, 1, 2, 3, 4, 5],
            labels = [];

        for (var i = 0; i < categories.length; i++) {
            labels.push(
                '<i style="background:' + cicleColor(categories[i] + 1) + '"></i> ' +
                categories[i] + (categories[i + 1] ? '&ndash;' + categories[i + 1] + '<br>' : '+'));
        };
        div.innerHTML += labels.join("")

        return div;
    };
    legend.addTo(myMap);

});

