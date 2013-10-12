angular.module( 'Stargate', [
  'templates-app',
  'templates-common',
  'Stargate.home',
  'Stargate.about',
  'Stargate.core',
  'Stargate.dashboard',
  'ui.state',
  'ui.route',
  'ui.bootstrap',
  'restangular',
  'security',
  'ngCookies'
])

.config( function StargateConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/dashboard' );
})

.run( function($http, security, $cookieStore) {
  // Get the current user when the application starts
  // (in case they are still logged in from a previous session)
  //security.requestCurrentUser();
  $http.defaults.headers.post['Authorization'] = 'ApiKey ' +
    $cookieStore.get('username') + ':' + $cookieStore.get('key');
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, security ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Stargate' ;
    }
  });
  $scope.security = security;

})

;

