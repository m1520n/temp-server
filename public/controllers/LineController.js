'use strict';

angular.module('myApp.GraphModule', [])

.controller('LineCtrl', function(dataService, $scope) {

  $scope.data = [];
  $scope.labels = [];
  $scope.startingDate = '';
  $scope.endingDate = '';
  $scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
  $scope.loading = false;

  $scope.averageTemperature = function() {
    var sum = $scope.data[0].reduce(function(a, b) { return a + b; });
    return sum / $scope.data[0].length;
  };

  $scope.dateRange = function() {
    var startingDate, endingDate;
    $scope.loading = true;

    startingDate = $scope.startingDate !== '' ?
      new Date($scope.startingDate) / 1000 :
      '';
    endingDate = $scope.endingDate !== '' ?
      new Date($scope.endingDate).setHours(23,59,59,999) / 1000 :
      '';

    dataService.getAllMeasurements(startingDate, endingDate)
    .then(function(data) {
      data = data.filter(function(obj) {
        return obj.reading !== undefined;
      });
      $scope.data[0] = data.map(function(reading) {
        return reading.reading;
      });
      $scope.labels = data.map(function(reading) {
        return new Date(
          parseInt(reading.date.substring(0, 8), 16) * 1000
        )
        .toString()
        .slice(4,24);
      });
      $scope.avg = $scope.averageTemperature();
      $scope.loading = false;
    });
  };

  $scope.dateRange();

  $scope.options = {
    tooltipEvents: [],
    tooltipCaretSize: 1,
    showTooltips: true,
    onAnimationComplete: () => {
      this.showTooltip(this.segments, true);
    },
    scales: {
      yAxes: [
        {
          id: 'Time',
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            suggestedMin: 0,
            max: 40,
            stepSize: 5
          }
        },
        {
          id: 'Temperature',
          type: 'linear',
          display: false,
          position: 'right'
        }
      ]
    }
  };
});
