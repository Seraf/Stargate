angular.module('security.login.form', [])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'login', {
    url: '/login',
    views: {
      "main": {
        controller: 'LoginFormController',
        templateUrl: 'security/login/form.tpl.html'
      }
    },
    data:{ pageTitle: 'Login' }
  });
})

// The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
// This controller and its template (login/form.tpl.html) are used in a modal dialog box by the security service.
.controller('LoginFormController', ['$scope', 'security', function($scope, security) {
  // The model for this form 
  $scope.user = {};

  // Any error message from failing to login
  $scope.authError = null;

  // Attempt to authenticate the user specified in the form's model
  $scope.login = function() {
    // Clear any previous security errors
    $scope.authError = null;

    // Try to login
    security.login($scope.user.username, $scope.user.password);
  };

  $scope.clearForm = function() {
    $scope.user = {};
  };
}]);
