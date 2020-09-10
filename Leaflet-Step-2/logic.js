 
 function createMap(earthquakeData, plateData) {

        
        // Define lightmap, outdoor, and satelite layers

         const satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.satellite",
            accessToken: API_KEY
        });

        const lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.light",
            accessToken: API_KEY
        });

        const outdoorMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.outdoors",
            accessToken: API_KEY
        });

        // Define a baseMaps object to hold our base layers
        const baseMaps = {
                "Satellite": satelliteMap,
                "Grayscale": lightMap,
                "Outdoors" : outdoorMap
        };

         // A function that detects the color based on earthquake magnitude:

         function color_detection(d) {
                return d > 5 ? "red" :
                d > 4 ?  "#FF4500":
                d > 3 ? "#FF7F50" :
                d > 2 ? "#FFA500" :
                d > 1 ? "#FFD700" :
                "#ADFF2F";
                };

        function onEachFeature(e, layer) {
                layer.bindPopup("<h3>" + e.properties.place +
                "</h3><hr><p>" + new Date(e.properties.time) + "</p>");
            }

        // Create a GeoJSON layer containing the features array on the earthquakeData object
        // Run the onEachFeature function once for each piece of data in the array
        // const earthquakes = L.geoJSON(earthquakeData, {
        // onEachFeature: onEachFeature
        // });


        // create one marker for each earthquake object:
        earthquakes = L.geoJSON(earthquakeData, {
                pointToLayer: function (feature,
                latlng) {
                        return L.circleMarker(latlng,{
                                radius: (feature.properties.mag)*4, //expressed in pixels
                                fillColor:  color_detection(feature.properties.mag),
                                color: color_detection(feature.properties.mag),
                                weight: 1, //outline width
                                opacity: 1, //line opacity
                                fillOpacity: 0.8
                                });
                },
                onEachFeature : onEachFeature
       })

        var myStyle = { // Define your style object
                color: "red",
                opacity: 1,
                fillColor: 'none'
        }
        
 
        const plates = L.geoJSON(plateData, {
                style: myStyle
        });
       
        const overlayMaps = {
                "Fault Lines" : plates,
                Earthquakes: earthquakes
                
        };

        const myMap = L.map("map", {
                center: [37.773972, -122.431297],
                zoom: 4,
                layers: [satelliteMap, earthquakes]
        });

        // Create a layer control
        // Pass in our baseMaps and overlayMaps
        // Add the layer control to the map

        L.control.layers(baseMaps, overlayMaps, {
                collapsed: false
        }).addTo(myMap);
       

        // Creating Legends:

        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = ["0-1", "1-2" , "2-3" , "3-4" , "5+"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
                        div.innerHTML +=
                        '<i style="background:' + color_detection(grades[i] + 1) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
};

// Adding legends to the Map:

legend.addTo(myMap);
   
};



(async function(){
    const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    const data1 = await d3.json(queryUrl);
    const data2 = await d3.json("plates.json");
    // Once we get a response, send the data.features object to the createFeatures function
    createMap(data1.features, data2.features);
})()
