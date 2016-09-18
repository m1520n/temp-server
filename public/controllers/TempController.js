angular.module('myApp.TempModule', [])

.controller('tempController', ($scope, $http, $interval) => {
  'use strict';
  
  $interval(() => {
    $http.get('http://212.106.164.162:8000/reading')
    .success((res) => {
      $scope.reading = res.reading;
    });
  }, 1000);
});
