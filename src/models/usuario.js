var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/baseNodinho';
mongoose.connect(url);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuario = new Schema({
  nome:  String,
  email: String,
  senha:   String
});

usuario.methods.findByEmail = function(cb) {
  return this.model('Usuario').find({ email: this.email }, cb);
};

usuario.methods.findByNome = function(cb) {
  return this.model('Usuario').find({ nome: this.nome }, cb);
};