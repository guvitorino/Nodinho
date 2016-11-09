var express = require("express");
var app = express();
var path = require('path');
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/baseNodinho';

var bodyparser = require('body-parser');

app.use(bodyparser.json());


app.get("/",function (req, res){
	res.sendFile(path.join(__dirname +"/public/index.html"));
})
app.get("/entrar",function (req, res){
	res.sendFile(path.join(__dirname +"/public/entrar.html"));
})
app.get("/cadastrar",function (req, res){
	res.sendFile(path.join(__dirname +"/public/cadastrar.html"));
})

app.get("/script/usu",function (req, res){
	res.sendFile(path.join(__dirname +"/public/script/usuctrl.js"));
})


app.post("/usuario/salvar",function (req, res){
	//console.log(req.body.params.usuario);
	usuario = req.body.params.usuario;

	if(usuario.nome == null){
		console.error("Ocorreu algum problema");
  		res.status(500).send('Acontenceu algum problema!');
  	}else{
		MongoClient.connect(url, function (err, db) {
		  if (err){
		  	console.error(err.stack);
	  		res.status(500).send('Acontenceu algum problema!');
		  }else {
		    var collection = db.collection('usuarios');

		    //Salvar Usuario
		    var salva_usu = {nome: usuario.nome, email: usuario.email, senha: usuario.senha};
		
		    collection.insert(salva_usu, function (err, result) {
		      if (err){
		      	console.error("Ocorreu algum problema");
	  			res.status(500).send('Acontenceu algum problema!');
		      }else res.status(200).send("Salvo!");
		    });

		    //Fecha a conexão
		    db.close();
		  }
		});
	}
})

app.post("/usuario/login",function (req, res){
	usuario = req.body.params.usuario;
	console.log(usuario);
	if(usuario.email == null){
		console.error("Ocorreu algum problema");
  		res.status(500).send('Acontenceu algum problema!');
  	}else{
		MongoClient.connect(url, function (err, db) {
		  if (err){
		  	console.error(err.stack);
	  		res.status(500).send('Acontenceu algum problema!');
		  }else {
		    var collection = db.collection('usuarios');

		    collection.findOne({email: usuario.email}, function(err, document) {
			  if (err){
		      	console.error("Ocorreu algum problema");
	  			res.status(500).send('Acontenceu algum problema!');
		      }else res.status(200).json({id: document._id,nome: document.nome });
			});

		    //Fecha a conexão
		    db.close();
		  }
		});
	}
})

app.listen(process.env.PORT || 8000, function () {
    console.log('Listening on http://localhost:' + (process.env.PORT || 8000));
});