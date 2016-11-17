var express = require("express");
var app = express();

var path = require('path');
var mongodb = require('mongodb');

var ObjectID = require('mongodb').ObjectID;
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var secret = 'M1lGr4u'


var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/baseNodinho';

var bodyparser = require('body-parser');


app.use(bodyparser.json());
app.use(express.static("./public"));

function encrypt(v,tipo){
  var cipher = crypto.createCipher(algorithm,tipo);
  var crypted = cipher.update(v,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(v,tipo){
  var decipher = crypto.createDecipher(algorithm,tipo)
  var dec = decipher.update(v,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function verifica(cod,token, callback){
	//console.log(cod);
	var id = new ObjectID(cod);
	MongoClient.connect(url, function (err, db) {
	  if (err){
	  	console.error(err.stack);
  		callback(null);
	  }else {
	    var collection = db.collection('usuarios');
	    collection.findOne({"_id": id}, function(err, document) {
		  if (err){
	      	console.error("Ocorreu algum problema");
  			callback(null);
	      }else{
	      	strcomp = document._id + document.nome;
	      	if( token == encrypt(strcomp,secret)){
	      		callback(document.nome);
	      	}else{
	      		callback(null);
	      	}
	      }
		});

	    //Fecha a conexão
	    db.close();
	  }
	});
}


app.get("/redi",function (req, res){
	dados = JSON.parse(req.query.dados);
	
	verifica(dados.cod,dados.tok,function(nome){
		if(nome != null){
			link = "socialize.html";
			res.status(200).json({url:link, nome:nome});
		}else{
			res.status(401).send("Você não Possui permissao");
		}
	});

	
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

app.post("/usuario/addamigo",function (req, res){
	//console.log(req.body.params.usuario);
	usuario = req.body.params.usuario;
	amigo = req.body.params.amigo;
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

		    
		    collection.update({_id:new ObjectID(usuario._id)},
		    	{$push:
		    		{
		    			amigos:{usuario:amigo}
		    		}
		    	}, 
		    	function (err, result) {
			      if (err){
			      	console.error("Ocorreu algum problema");
		  			res.status(500).send('Acontenceu algum problema!');
			      }else{
			      	//console.log(result);
			      	res.status(200).send("Atualizado!");
			      } 
		    	});

		    //Fecha a conexão
		    db.close();
		  }
		});
	}
})

app.post("/autorize",function (req, res){

	usuario = req.body.params.usuario;
	//console.log(usuario);
	//console.log(usuario);
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
		      }else{
		      	console.log(usuario.senha + " "+document.senha);
		      	if(document.senha == usuario.senha){
		      		v = document._id + document.nome;
			        res.status(200).json({cod: document._id ,tok: encrypt(v,secret)});
		      	}else{
		      		res.status(401).send('Tente outra vez!');
		      	}
		      }
			});

		    //Fecha a conexão
		    db.close();
		  }
		});
	}
})

app.post("/postagem",function (req, res){
	postagem = req.body.params.postagem;
	var id = new ObjectID(postagem.cod);
	if(postagem.textao == null){
		console.error("Ocorreu algum problema");
  		res.status(500).send('Acontenceu algum problema!');
  	}else{
		MongoClient.connect(url, function (err, db) {
		  if (err){
		  	console.error(err.stack);
	  		res.status(500).send('Acontenceu algum problema!');
		  }else {
		    var collection = db.collection('postagens');

		    var salva_post = {descricao:postagem.textao,autor: id, nome_autor:postagem.nomeautor,data: new Date()};
		    collection.insert(salva_post, function (err, result) {
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

app.get("/postagem",function (req, res){
		MongoClient.connect(url, function (err, db) {
		  if (err){
		  	console.error(err.stack);
	  		res.status(500).send('Acontenceu algum problema!');
		  }else {
		    var collection = db.collection('postagens');
		    collection.find().sort({data: -1}).toArray(function(err, document) {
                 if (err){
			      	console.error("Ocorreu algum problema");
		  			res.status(500).send('Acontenceu algum problema!');
			      }else{
			      	res.status(200).json(document);
			      }
             });
		    //Fecha a conexão
		    db.close();
		  }
		});
})

app.get("/usuarios",function (req, res){
		MongoClient.connect(url, function (err, db) {
		  if (err){
		  	console.error(err.stack);
	  		res.status(500).send('Acontenceu algum problema!');
		  }else {
		    var collection = db.collection('usuarios');
		    collection.find().toArray(function(err, document) {
                 if (err){
			      	console.error("Ocorreu algum problema");
		  			res.status(500).send('Acontenceu algum problema!');
			      }else{
			      	res.status(200).json(document);
			      }
             });
		    //Fecha a conexão
		    db.close();
		  }
		});
})

app.listen(process.env.PORT || 8000, function () {
    console.log('Listening on http://localhost:' + (process.env.PORT || 8000));
});