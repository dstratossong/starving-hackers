var http = require("http")
var fs = require("fs")
http.createServer(function(req,res){
	var filePath= '.' +req.url;
	fs.readFile(filePath,"utf-8",function(e,r){
		res.end(r)
		console.log("fddd")
	});
}).listen(8080);