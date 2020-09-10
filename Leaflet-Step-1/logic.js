 function createMap(earthquakeData) {

        // Create a map object

        const myMap = L.map("map", {
                center: [37.773972, -122.431297],
                zoom: 4
                });
        
        // Define lightmap layers

        L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.light",
            accessToken: API_KEY
        }).addTo(myMap);

       
        // A function that detects the color based on earthquake magnitude:

        function color_detection(d) {
                return d > 5 ? "red" :
                d > 4 ?  "#FF4500":
                d > 3 ? "#FF7F50" :
                d > 2 ? "#FFA500" :
                d > 1 ? "#FFD700" :
                "#ADFF2F";
                };

        // A function that detects the radius based on earthquake magnitude:

        function radius_detection(mag){
                r = mag*20000;
                return r;
        }

        // Loop through the earthquakes array and create one marker for each earthquake object:

        earthquakeData.forEach(e => {
                L.circle([e.geometry.coordinates[1], e.geometry.coordinates[0]], {
                fillOpacity: 0.75,
                weight: 0.5,
                color: "black",
                fillColor: color_detection(e.properties.mag),
                radius: radius_detection(e.properties.mag)
        }).bindPopup("<h3>" + e.properties.place +
        "</h3><hr><p>" + new Date(e.properties.time) + "</p>").addTo(myMap);
    });

  

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
   

}

(async function(){
    const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    const data = await d3.json(queryUrl);
    // Once we get a response, send the data.features object to the createFeatures function
    createMap(data.features);
})()
