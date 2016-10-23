var http = require("http")
var fs = require("fs")
http.createServer(function(req,res){
	fs.readFile(req.url,"utf-8",function(e,r){
		res.end(r)
		console.log("fd")
	});
}).listen(8080);