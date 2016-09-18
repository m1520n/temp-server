'use strict';

angular.module('myApp.DataModule', [])

.service('dataService', function($http, $q) {

  function getAllMeasurements(start, end) {
    let api = 'http://212.106.164.162:8000/readings';
    let data = [];
    let myPromise = $q.defer();

    if (start !== '' || end !== '') {
      api += '/dates/?start=' + start + '&end=' + end;
    }

    $http.get(api)
    .success((res) => {
      data = res.map((r) => {
        let rObj = {};
        rObj.reading = r.reading;
        rObj.date = r._id;
        return rObj;
      });
      let arr = [];
      let dataLength = data.length;
      let maxItems = 50;
      if (dataLength > maxItems) {
        let delta = Math.floor(dataLength / maxItems);
        for (let i = 0; i < dataLength; i = i + delta) {
          arr.push(data[i]);
        }
        data = arr;
      }

      myPromise.resolve(data);
    });
    return myPromise.promise;
  }

  return {
    getAllMeasurements: getAllMeasurements
  };
});
