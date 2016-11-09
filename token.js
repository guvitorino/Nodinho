var express = require("express");
var app = express();
var path = require('path');
var mongodb = require('mongodb');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var secret = 'M1lGr4u'
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/baseNodinho';

var bodyparser = require('body-parser');
app.use(bodyparser.json());

function encrypt(v){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(v,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

app.get("/",function (req, res){
	res.status(200).json({message: "Funcionando"});
})

app.post("/autorize",function (req, res){
	res.setHeader('Access-Control-Allow-Origin','*');
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
		      }else{
		      	v = id + nome;
		      } res.status(200).json({token: encrypt(v) });
			});

		    //Fecha a conexão
		    db.close();
		  }
		});
	}
})

app.listen(process.env.PORT || 8010, function () {
    console.log('Listening on http://localhost:' + (process.env.PORT || 8010));
});