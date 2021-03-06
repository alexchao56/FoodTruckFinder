// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
var map;
var markers = [];
var markers_map = {};

function initialize() {
  
  var sanFrancisco = new google.maps.LatLng(37.7833, -122.4167);

  var mapOptions = {
    zoom: 14,
    center: sanFrancisco,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    panControl: true,
    zoomControl: true,
    scaleControl: true
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
          document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
    map.setZoom(16);
    fillMap();
  });
  // [END region_getplaces]



  // Adds a marker at the center of the map.
  // addMarker(sanFrancisco);
  var center = new google.maps.Marker({
      position: sanFrancisco,
      map: map,
      title: "San Francisco",
  });
  markers.push(center);
  var infoWindow = new google.maps.InfoWindow({});
  infoWindow.setContent("<b>San Francisco<b>");

  google.maps.event.addListener(center, 'click', function() {
    infoWindow.open(map, center)
  });
  
  closeInfoWindow = function() {
    infoWindow.close();  
  }
  
  google.maps.event.addListener(map, 'click', closeInfoWindow);

  fillMap(); 
}

// Add a marker to the map and push to the array.
function addMarker(location, row_id) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: row_id + "",
    icon : 'https://raw.githubusercontent.com/alexchao56/FoodTruckFinder/master/images/foodTruckIcon.ico'
  });
  markers.push(marker);
  markers_map[row_id] = marker;

  var address = getAddress(row_id);
  var name = getName(row_id);
  var category = getCategory(row_id);
  var foodItems = getFoodItems(row_id);

  var message = "<p><b>" + name + "</b></p>" +
      "<p>" + address + "</p>" +
      "<p><i>" + category + "</i></p>";

  var infoWindow = new google.maps.InfoWindow({});

  infoWindow.setContent(message);

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.open(map, marker)
  });


  closeInfoWindow = function() {
    infoWindow.close();
  }

  google.maps.event.addListener(map, 'click', closeInfoWindow);

  
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

//Fill map with initial markers
function fillMap() {
    for (var i = 0; i < data.length; i++) {
        var point = new google.maps.LatLng(data[i]["Latitude"], data[i]["Longitude"]);
        addMarker(point, data[i][""]);
    }
}

//Handling updates
function handleUpdate() {
    for (var i = 0; i < data.length; i++) {
        if ($.inArray(data[i],validMarkers) != -1) {
          if ($.inArray(markers_map[data[i][""]], markers) == -1) {
            markers_map[data[i][""]].setMap(map);
            markers.push(markers_map[data[i][""]]);
          }
        } else {
          if ($.inArray(markers_map[data[i][""]], markers) != -1) {
            markers_map[data[i][""]].setMap(null);
            markers.splice($.inArray(markers_map[data[i][""]], markers), 1);
          }   
        }
    }
}

function getAddress(row_id) {
    for (var i = 0; i < validMarkers.length; i++) {
        if (validMarkers[i][""] == row_id) {
            return validMarkers[i]["Address"]
        }
    }
}

// Return the name of the food truck.
function getName(row_id) {
    for (var i = 0; i < validMarkers.length; i++) {
        if (validMarkers[i][""] == row_id) {
            return validMarkers[i]["Applicant"];
        }
    }
}

// Returns the category that a food truck is in.
function getCategory(row_id) {
    for (var i = 0; i < validMarkers.length; i++) {
        if (validMarkers[i][""] == row_id) {
            var category = validMarkers[i]["FoodItems"].split(":");
            return category[0];
        }
    }
}

// Returns an array of all fooditems that a food truck offers.
function getFoodItems(row_id) {
    for (var i = 0; i < validMarkers.length; i++) {
        if (validMarkers[i][""] == row_id) {
            return validMarkers[i]["FoodItems"].split(":");
        }
    }
}

google.maps.event.addDomListener(window, 'load', initialize);
