var my_http = require("http");
my_http.createServer(function(req,res){	
	res.writeHeader(200,{"Content-Type": "text/plain"});
	res.write("Hello MSRIT");
	res.end();
}).listen(5000);
console.log("Server running on 5000");
