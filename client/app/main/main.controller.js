'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $http) {

    $http.get('/api/detectors').success(function(detectors) {
      log(detectors);
    });

    $scope.appVer = APP_VERSION;
  });
