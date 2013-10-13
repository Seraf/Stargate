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
  'ui.router',
  'security'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */


.controller( 'MenuCtrl', function LoginController ($scope) {
    $scope.oneAtATime = true;

    $scope.groups = [
      {
        title: "Dashboard",
        url: "#/dashboard",
        icon: "icon-dashboard"
      },
      {
        title: "Tickets",
        content: [
          {"title": "Actions", "url": "#/actions", "icon": "icon-hand-up"}
        ],
        icon: "icon-link"
      },
      {
        title: "Labs",
        content: [
          {"title": "API", "url": "#/api", "icon": "icon-info-sign"},
          {"title": "Actions", "url": "#/actions", "icon": "icon-th-large"},
          {"title": "Monitoring", "url": "#/monitoring", "icon": "icon-table"}
        ],
        icon: "icon-beaker"
      }
    ];
})

;

