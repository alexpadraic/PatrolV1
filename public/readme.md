
### Import csv of analyzed data
mongoimport -d patrol -c crimepoints --type csv --file CrimePoints_forupload.csv --headerline


<script>

      // This example requires the Visualization library. Include the libraries=visualization
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

      var map, heatmap;


      function initMap() {
        var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);
        map = new google.maps.Map(document.getElementById('map'), {
          center: sanFrancisco,
          zoom: 12,
          mapTypeId: 'satellite'
        });

        heatmap = new google.maps.visualization.HeatmapLayer({
          data: getPoints(),
          map: map
        });
        changeGradient();
      }

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


    function getPoints() {
      return [
        {location: new google.maps.LatLng(37.775, -122.403), weight: 3.06849315068493},
        {location: new google.maps.LatLng(37.778, -122.406), weight: 1.91780821917808}
      ];
    }

    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAPt34WnRJS3S7BvZ2N-n76FFV5VFY6b_A&libraries=visualization&callback=initMap">
    </script>