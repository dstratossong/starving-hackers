var mainControllers = angular.module('mainControllers', ['ngStorage']);

mainControllers.controller('MainController', ['$rootScope', '$scope', '$http', '$localStorage', '$timeout', '$interval',
function($rootScope, $scope, $http, $localStorage, $timeout, $interval) {

	// To store the string from user input
	$scope.dataField = '';
	$scope.listBtnText = 'Add';
	$scope.$storage = $localStorage.$default({
		guestsList : $scope.guests
	});

	$scope.hide_logo = false;

	// function to set the default data
	$scope.reset = function() {

		$scope.hey = "Hey" + (numb++);
	};
	var numb = 0;
	$scope.hey = "___";

	$scope.$storage.x = '';
	
	


}]);
