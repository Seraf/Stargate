angular.module('security.service', [
  'security.retryQueue',    // Keeps track of failed requests that need to be retried once the user logs in
  'security.login',         // Contains the login form template and controller
  'ngCookies'
])

.factory('security', ['$http', '$q', '$location', 'securityRetryQueue', function($http, $q, $location, queue, Restangular, $cookieStore) {

  // Redirect to the given url (defaults to '/')
  function redirect(url) {
    url = url || '/dashboard';
    $location.path(url);
  }

  // Register a handler for when an item is added to the retry queue
  queue.onItemAddedCallbacks.push(function(retryItem) {
    if ( queue.hasMore() ) {
      service.showLogin();
    }
  });

  // The public API of the service
  var service = {

    showLogin: function() {
      redirect('/login');
    },

    // Attempt to authenticate a user by the given email and password
    login: function(username, password) {
      var request = $http.post(
        'http://api.stargate.enovance.com:8000/api/v1/user/login/',
        JSON.stringify({ username: username, password: password })
      ).success(
        function(data) {
          user = JSON.parse(data.user);
          service.currentUser = user;
          service.cookieStore.put('username', user.username);
          service.cookieStore.put('key', data.key);
          service.cookieStore.put('user', service.currentUser);
          $http.defaults.headers.common['Authorization'] = 'ApiKey ' +
            user.username + ':' + data.key;
          if ( service.isAuthenticated() ) {
            redirect();
          }
        }
      ).error(
        function(data) {
          errorMsg = data.reason;
        }
      );
    },

    // Logout the current user and redirect
    logout: function(redirectTo) {
      service.currentUser = null;
      redirect('/login');
    },

    // Ask the backend to see if a user is already authenticated
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        return $q.when(service.currentUser);
      } else {
        $http.defaults.headers.post['Authorization'] = 'ApiKey ' +
            service.cookieStore.get('username') + ':' + service.cookieStore.get('key');
        service.currentUser = service.cookieStore.get('user');
        return service.currentUser;
      }
    },

    // Information about the current user
    currentUser: null,

    // Is the current user authenticated?
    isAuthenticated: function(){
      return !!service.currentUser;
    },
    
    // Is the current user an adminstrator?
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.admin);
    }
  };

  return service;
}]);