//importa o mongoDB
var mongodb = require('mongodb');

//setando o mongo cliente
var MongoClient = mongodb.MongoClient;

// endereço banco
var url = 'mongodb://localhost:27017/baseNodinho';

// Metodo que realiza a conexao
MongoClient.connect(url, function (err, db) {
  if (err)console.log('Houve algum problema ao realizar a conexão com o banco. Erro:', err);
  else {
    console.log('Conexão estabelecida com', url);

    //setando a collection  que estamos usando
    var collection = db.collection('postagens');

    //Criando algumas postagens
    var posta1 = {descricao: "realizando a primeira postagen", data:"07-11-16"};
    var posta2 = {descricao: "realizando a segunda postagen", data:"07-11-16"};
    var posta3 = {descricao: "realizando a terceira postagen", data:"07-11-16"};

    // Inserir as postagens
    collection.insert([posta1, posta2, posta3], function (err, result) {
      if (err) console.log(err);
      else console.log('Inserido postagens na collection. Os documentos foram inseridos com os seguintes "_id":', result.length, result);
    });

    //Fecha a conexão
    db.close();
  }
});