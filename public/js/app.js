// Declares the initial angular module "patrolMapApp". Module grabs other controllers and services.
var app = angular.module('patrolMapApp', ['addCtrl', 'queryCtrl', 'headerCtrl', 'geolocation', 'gservice', 'ngRoute'])

  // Configures Angular routing -- showing the relevant view and controller when needed.
  .config(function($routeProvider){

    // Join Patrol Control Panel
    $routeProvider.when('/find', {
    // Find Patrollers Control Panel
      controller : 'queryCtrl',
      templateUrl: 'partials/queryForm.html',

    // All else forward to the Join Patrol Control Panel
    }).otherwise({redirectTo:'/find'})
  });