var express = require("express");
var app = express();
var path = require('path');

app.get("/",function (req, res){
	res.sendFile(path.join(__dirname +"/public/index.html"));
})
app.get("/entrar",function (req, res){
	res.sendFile(path.join(__dirname +"/public/entrar.html"));
})
app.get("/cadastrar",function (req, res){
	res.sendFile(path.join(__dirname +"/public/cadastrar.html"));
})
app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
});