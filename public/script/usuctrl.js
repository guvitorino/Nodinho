angular.module("socialize").controller("usuctrl", function ($scope,$http) {
	$scope.app = "socialize";
	$scope.usuario = [];


	$scope.adicionarUsuario = function (usuario) {
		usuario.tipo = verificaTipoMarcado();
		$http.post("", {nome:usuario.nome, email: usuario.email, senha: usuario.senha})
		.success(function (data) {
			delete $scope.usuario;
			$scope.salvo = true;
			$scope.cadastraUsuario.$setPristine();
		}).error(function (data) {
			$scope.erro = true;
			$scope.message = "Aconteceu um problema: " + data;
		});
	};
						
});