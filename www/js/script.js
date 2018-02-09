angular.module('app', ['ngRoute'])
//---------------
// Services
//---------------
.factory('Users', function(){

    var table = document.querySelector("table");
    var data  = parseTable(table);

    return data;
})
//---------------
// Controllers
//---------------
.controller('UserController', ['$scope', 'Users', function ($scope, Users) {
    $scope.users = Users;
}])
.controller('UserDetailCtrl', ['$scope', '$routeParams', 'Users', function ($scope, $routeParams, Users) {
    $scope.user = Users[$routeParams.id];
}])
//---------------
// Routes
//---------------
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: '/user.html',
        controller: 'UserController'
    })
    .when('/:id', {
        templateUrl: '/userDetails.html',
        controller: 'UserDetailCtrl'
    });
}]);


document.querySelector('#zebi').addEventListener('click', function(e) {
    e.preventDefault();
});