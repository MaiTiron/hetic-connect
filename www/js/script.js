

// Attendre le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  //document.querySelector('button').submit( (e) => e.preventDefault() );
},





angular.module('app', ['ngRoute'])
//---------------
// Services
//---------------
.factory('Todos', function(){

var table = document.querySelector("table");
var data  = parseTable(table);
console.log(data);
return data;

})
//---------------
// Controllers
//---------------
.controller('TodoController', ['$scope', 'Todos', function ($scope, Todos) {
$scope.todos = Todos;
}])
.controller('TodoDetailCtrl', ['$scope', '$routeParams', 'Todos', function ($scope, $routeParams, Todos) {
$scope.todo = Todos[$routeParams.id];
}])
//---------------
// Routes
//---------------
.config(['$routeProvider', function ($routeProvider) {
$routeProvider
  .when('/', {
    templateUrl: '/todos.html',
    controller: 'TodoController'
  })
  .when('/:id', {
    templateUrl: '/todoDetails.html',
    controller: 'TodoDetailCtrl'
 });
}]));
