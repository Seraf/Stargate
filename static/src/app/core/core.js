/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'Stargate.core', [
  'ui.state',
  'http-auth-interceptor',
  'ngCookies'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'login', {
    url: '/login',
    views: {
      "main": {
        controller: 'LoginCtrl',
        templateUrl: 'core/views/login.tpl.html'
      }
    },
    data:{ pageTitle: 'Login' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'LoginCtrl', function LoginController ($scope, $http, authService, $cookieStore) {
    $scope.login = function() {
      $http.post(
        'http://192.168.1.22:8000/api/v1/user/login/',
        JSON.stringify({ username: $scope.username, password: $scope.password })
      ).success(
        function(data) {
          //problem creating cookie
          $cookieStore.put('username', data.username);
          $cookieStore.put('key', data.key);
          $http.defaults.headers.common['Authorization'] = 'ApiKey ' +
            data.username + ':' + data.key;
          authService.loginConfirmed();
        }
      ).error(
        function(data) {
          $scope.errorMsg = data.reason;
        }
      );
    };
    $scope.logout = function() {
      $http.post('http://192.168.1.22:8000/api/v1/user/logout/').success(function() {
        $scope.restrictedContent = [];
        $cookieStore.put('key', null);
        $http.defaults.headers.common['Authorization'] = null;
      }).error(function() {
        // This should happen after the .post call either way.
        $cookieStore.put('key', null);
        $http.defaults.headers.common['Authorization'] = null;
      });
    };
})

;

