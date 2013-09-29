angular.module( 'Stargate', [
  'templates-app',
  'templates-common',
  'Stargate.home',
  'Stargate.about',
  'Stargate.core',
  'ui.state',
  'ui.route'
])

.config( function StargateConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Stargate' ;
    }
  });
})

;

