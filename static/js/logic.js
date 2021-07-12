//Quake URL
var weekURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Get request on baseURL
d3.json(weekURL, function(response){
  console.log(response)
  createFeatures(response.features);
  console.log(response.features[0].geometry.coordinates[2])
});

//Function to grab data from each feature for pop up and map
function createFeatures(data) {
  
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p><strong>Magnitude: </strong>" + 
      feature.properties.mag + "<br><strong>Depth: </strong>" +
      feature.geometry.coordinates[2] + " m <br> <strong>Time: </strong>" + 
      new Date(feature.properties.time) + "</p>")
  }

  function getColor(d) {
    if (d <= 10) {
      return "LawnGreen"
    }
    else if (d <= 30) {
      return "GreenYellow"
    }
    else if (d <= 30) {
      return "GYellow"
    }
    else if (d <= 30) {
      return "Gold"
    }
    else if (d <= 30) {
      return "Orange"
    }
    else {
      return "Red"
    }
  };

  function pointToLayer(feature, latlng) {
    var geojsonMarkerOptions = {
      fillColor: getColor(feature.geometry.coordinates[2]),
      radius: feature.properties.mag * 2,
      fillOpacity: 0.8,
      color: "white",
      weight: 2
    }
    return L.circleMarker(latlng, geojsonMarkerOptions);
  };

  var quakes = L.geoJSON(data, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });

  createMap(quakes);
};

function createMap(quakes) {
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Dark": darkmap,
    "Outdoor": outdoormap,
    "Satellite": satellitemap
  };

  var overlayMaps = {
    Earthquakes: quakes
  };
  
  // Creating our initial map object
  // We set the longitude, latitude, and the starting zoom level
  // This gets inserted into the div with an id of 'map'
  var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 3,
    layers: [outdoormap, quakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};


  // //Create new marker cluster group
  // var markers = L.markerClusterGroup();

  // //Loop through data
  // for (var i = 0; i < response.length; i++) {
    
  //   //set geometry property to variable
  //   var location = response.feature[i].geometry;

  //   //check for geometry property
  //   if (geometry) {
  //     markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
  //     )};
  // }

  // myMap.addLayer(markers)
