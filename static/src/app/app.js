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

.run( ['$http', '$cookieStore', 'security', function($http, $cookieStore, security) {
  // Get the current user when the application starts
  // (in case they are still logged in from a previous session)
  security.cookieStore = $cookieStore;
  security.requestCurrentUser();

}])

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, security ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Stargate' ;
    }
  });
  $scope.security = security;

})

;

