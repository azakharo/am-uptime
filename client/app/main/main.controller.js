'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $http, $interval) {

    $scope.appVer = APP_VERSION;
    getDetectorsStatus();

    // Auto-update
    var statusUpd = $interval(getDetectorsStatus, 5000);
    $scope.$on('$destroy', function () {
      $interval.cancel(statusUpd);
    });

    function getDetectorsStatus() {
      $http.get('/api/detectors').success(function(detectors) {
        $scope.detectors = detectors;
      });
    }

  });
