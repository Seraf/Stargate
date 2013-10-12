angular.module( 'Stargate.dashboard', [
  'ui.state',
  'placeholders',
  'ui.bootstrap',
  'security.authorization'
])

.config(function config( $stateProvider, securityAuthorizationProvider ) {
  $stateProvider.state( 'dashboard', {
    url: '/dashboard',
    views: {
      "main": {
        controller: 'DashboardCtrl',
        templateUrl: 'dashboard/dashboard.tpl.html'
      }
    },
    resolve:{
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    },
    data:{ pageTitle: 'Dashboard' }
  });
})

.controller( 'DashboardCtrl', function DashboardCtrl( $scope ) {
  $scope.title = "Dashboard";
  $scope.icon = "icon-dashboard";
})

;























