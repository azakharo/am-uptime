'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.appVer = APP_VERSION;
    getDetectorsStatus();

    function getDetectorsStatus() {
      $http.get('/api/detectors').success(function(detectors) {
        $scope.detectors = detectors;
      });
    }

  });
