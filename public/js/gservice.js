// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
  .factory('gservice', function($rootScope, $http){

    // Initialize Variables
    // -------------------------------------------------------------
    // Service our factory will return
    var googleMapService = {};

    // Handling Clicks and location selection
    googleMapService.clickLat  = 0;
    googleMapService.clickLong = 0;

    // Array of locations obtained from API calls
    var locations = [];

    // Variables we'll use to help us pan to the right spot
    var lastMarker;
    var currentSelectedMarker;

    // Selected Location (initialize to Sutro Tower - San Francisco)
    var selectedLat  = 37.755;
    var selectedLong = -122.453;

    // Map styling
    var styles = [
      { "featureType": "all",
      "elementType": "labels.text",
      "stylers"    : [{"visibility": "off"}]
      },
      { "featureType": "all",
      "elementType": "labels.icon",
      "stylers"    : [{"visibility": "off"}]
      },
      { "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers"    : [{"color": "#000000"}]
      },
      { "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers"    : [{"color": "#144b53"},{"lightness": 14},{"weight": 1.4}]
      },
      { "featureType": "landscape",
      "elementType": "all",
      "stylers"    : [{"color": "#08304b"}]
      },
      { "featureType": "poi",
      "elementType": "geometry",
      "stylers"    : [{"color": "#0c4152"},{"lightness": 5}]
      },
      { "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers"    : [{"color": "#000000"}]
      },
      { "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers"    : [{"color": "#0b434f"},{"lightness": 25}]
      },
      { "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers"    : [{"color": "#000000"}]
      },
      { "featureType": "road.arterial",
      "elementType": "geometry.stroke",
      "stylers"    : [{"color": "#0b3d51"},{"lightness": 16}]
      },
      { "featureType": "road.local",
      "elementType": "geometry",
      "stylers"    : [{"color": "#000000"}]
      },
      { "featureType": "transit",
      "elementType": "all",
      "stylers"    : [{"color": "#146474"}]
      },
      { "featureType": "water",
      "elementType": "all",
      "stylers"    : [{"color": "#021019"}]
      }
    ];


    // Functions
    // --------------------------------------------------------------
    // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
    googleMapService.refresh = function(latitude, longitude, filteredResults){

      // Clears the holding array of locations
      locations = [];

      // Set the selected lat and long equal to the ones provided on the refresh() call
      selectedLat  = latitude;
      selectedLong = longitude;

      // If filtered results are provided in the refresh() call...
      if (filteredResults){

        // Then convert the filtered results into map points.
        locations = convertToHeatmapPoints(filteredResults);

        // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
        initialize(latitude, longitude, true);
      }

      // If no filter is provided in the refresh() call...
      else {

        // Perform an AJAX call to get all of the queried records in the db.
        $http.get('/crimepoints?dayofweek=0&hour=0')
        .success(function(response){

          // Then convert the results into map points
          locations = convertToHeatmapPoints(response);

          // Then initialize the map -- noting that no filter was used.
          initialize(latitude, longitude, false);
        })
        .error(function(){});
      }
    };

    // Private Inner Functions
    // --------------------------------------------------------------
    // Convert a JSON of heatmap points into map points
    var convertToHeatmapPoints = function(response){

      // Clear the locations holder
      var locations = [];

      // Loop through all of the JSON entries provided in the response
      for(var i = 0; i < response.length; i++) {
        var crimepoint = response[i];

        // Create popup windows for each record
        var contentString = " ";
        '<p><b>Day of Week</b>: '             + crimepoint.dayofweek +
        '<br><b>Hour</b>: '                   + crimepoint.hour      +
        '<br><b>Drinking/Drug Offenses</b>: ' + crimepoint.drugdrink +
        '<br><b>Midemeanor/Misc</b>: '        + crimepoint.misdemean +
        '<br><b>Theft/Burglary</b>: '         + crimepoint.theft     +
        '<br><b>Violent Acts</b>: '           + crimepoint.violent   +
        '<br><b>Total Crime Probability</b>: '+ crimepoint.total     +
        '</p>';

        // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
        locations.push(new Location(
          new google.maps.LatLng(crimepoint.location[1], crimepoint.location[0]),
          new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 320
          }),
          crimepoint.dayofweek,
          crimepoint.hour,
          crimepoint.drugdrink,
          crimepoint.misdemean,
          crimepoint.theft,
          crimepoint.violent,
          crimepoint.total
          ))
      }
      // location is now an array populated with records in Google Maps format
      return locations;
    };

    // Constructor for generic location
    var Location = function(latlon, message, dayofweek, hour, drugdrink, misdemean, theft, violent, total){
      this.latlon    = latlon;
      this.message   = message;
      this.dayofweek = dayofweek;
      this.hour      = hour;
      this.drugdrink = drugdrink;
      this.misdemean = misdemean;
      this.theft     = theft;
      this.violent   = violent;
      this.total     = total
    };

    // Initializes the map
    var initialize = function(latitude, longitude, filter) {

      // Uses the selected lat, long as starting point
      var myLatLng = {lat: selectedLat, lng: selectedLong};

      // If map has not been created...
      if (!map){

        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom  : 13,
          center: myLatLng,
          styles: styles
        });

        var heatmap = new google.maps.visualization.HeatmapLayer({
          data: getPoints(),
          dissipating: false,
          map : map
        });

        // function cpfeed_callback(results) {
        //   var heatmapData = [];
        //   for (var i = 0; i < results.features.length; i++) {
        //     var coords = results.features[i].geometry.coordinates;
        //     var latLng = new google.maps.LatLng(coords[1], coords[0]);
        //     heatmapData.push(latLng);
        //   }
        //   var heatmap = new google.maps.visualization.HeatmapLayer({
        //     data:        heatmapData,
        //     dissipating: false,
        //     map:         map
        //   });
        // }

        changeGradient();

        function toggleHeatmap() {
          heatmap.setMap(heatmap.getMap() ? null : map);
        }

        function changeGradient() {
          var gradient = [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
          ]
          heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
        }

        function changeRadius() {
          heatmap.set('radius', heatmap.get('radius') ? null : 20);
        }

        function changeOpacity() {
          heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
        }

        function returnPoints() {
          now = new Date();
          currentCrimepoints = db.crimepoints.find({"dayofweek":now.getDay(), "hour":now.getHours()}).pretty();
          console.log(currentCrimepoints)
        }

        function getPoints() {
          return [
          {location: new google.maps.LatLng(37.775, -122.403), weight: 3.06849315068493},
          {location: new google.maps.LatLng(37.778, -122.406), weight: 1.91780821917808}
          ];
        }
      }

      // Set initial location as a bouncing blue marker
      var initialLocation = new google.maps.LatLng(latitude, longitude);
      var marker = new google.maps.Marker({
        position : initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map      : map,
        icon     : '../map_icon_24.png'
      });
      lastMarker = marker;

      // Function for moving to a selected location
      map.panTo(new google.maps.LatLng(latitude, longitude));

      // // Clicking on the Map moves the bouncing blue marker
      google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
          position : e.latLng,
          animation: google.maps.Animation.BOUNCE,
          map      : map,
          icon     : '../map_icon_24.png'
        });

        // When a new spot is selected, delete the old blue bouncing marker
        if(lastMarker){
          lastMarker.setMap(null);
        }

        // Create a new blue bouncing marker and move to it
        lastMarker = marker;
        map.panTo(marker.position);

        // Update Broadcasted Variable (lets the panels know to change their lat, long values)
        googleMapService.clickLat  = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
      });
    };

    // Refresh the page upon window load. Use the initial latitude and longitude
    google.maps.event.addDomListener(window, 'load',
      googleMapService.refresh(selectedLat, selectedLong));

    return googleMapService;
  });
