angular.module("socialize").controller("usuctrl", function ($scope,$http) {
	$scope.app = "socialize";
	$scope.usuarios = [];
	$scope.pesquisa = [];
	$scope.postagens = [];

	var carregarPostagens = function () {
		$http.get("postagem")
		.success(function (data) {
			$scope.postagens = data;			
		}).error(function (data) {
			$scope.erro = true;
		});
	};
	var carregarUsuarios = function () {
		$http.get("usuarios")
		.success(function (data) {
			$scope.usuarios = data;	
			$scope.pesquisa = $scope.usuarios;
		}).error(function (data) {
			$scope.erro = true;
		});
	};

	$scope.pesquisar = function () {
		$scope.pesquisa = [];
		for (var i = $scope.usuarios.length - 1; i >= 0; i--) {
			if($scope.usuarios[i].nome.toUpperCase().indexOf($scope.pesq.nome.toUpperCase())>=0){
				$scope.pesquisa.push($scope.usuarios[i]);
			}
		}
	};
		
	$scope.verificaStatus = function () {
		$scope.usuario_logado = localStorage.getItem("status");
		if($scope.usuario_logado == null)
			window.location = "entrar";
		$scope.nome = localStorage.getItem("nome");
	};

	$scope.adicionarUsuario = function () {
		$http.post("usuario/salvar",{params:{"usuario":$scope.usuarioform}})
		.success(function (data) {
			delete $scope.usuarioform;
			alert(data);
			$scope.salvo = true;
			$scope.cadastraUsuario.$setPristine();
		}).error(function (data) {
			$scope.erro = true;
			$scope.message = "Aconteceu um problema: " + data;
		});
	};

	function redirecionar(){
		dados = {cod:localStorage.getItem("cod"),tok:localStorage.getItem("tok")};
		$http.get("redi",{params:{"dados":dados}})
		.success(function (data) {
			localStorage.setItem("nome",data.nome);
			window.location = data.url;
		}).error(function (data) {
			$scope.erro = true;
			$scope.message = "Aconteceu um problema: " + data;
		});
	}

	$scope.entrar = function () {
		$http.post("autorize",{params:{"usuario":$scope.loginform}})
		.success(function (data) {
			delete $scope.loginform;
			$scope.loginUsuario.$setPristine();
			//console.log(data.cod)
			localStorage.setItem("cod",data.cod);
			localStorage.setItem("tok",data.tok);
			localStorage.setItem("status",true);
			redirecionar();
			
		}).error(function (data) {
			$scope.erro = true;
		});
	};

	$scope.postar = function () {
		postagem = {textao:$scope.postagem.textao,cod:localStorage.getItem("cod"),nomeautor:localStorage.getItem("nome")}
		$http.post("postagem",{params:{"postagem":postagem}})
		.success(function (data) {
			delete $scope.postagem;
			$scope.textaoPost.$setPristine();
			carregarPostagens();
			alert(data);			
		}).error(function (data) {
			$scope.erro = true;
		});
	};		

	$scope.sair = function () {
		localStorage.clear();
		window.location = "/";
	};	

	carregarPostagens();	
	carregarUsuarios();			
});