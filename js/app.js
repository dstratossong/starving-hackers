var myApp = angular.module('myApp', ['ngRoute', 'mainControllers']);

myApp.config(['$routeProvider',
function($routeProvider) {
	$routeProvider.when('/settings', {
		templateUrl : 'views/settings.html',
		controller : 'MainController'
	}).when('/home', {
		templateUrl : 'views/home.html',
		controller : 'MainController'
	}).otherwise({
		redirectTo : '/home'
	});
}]);