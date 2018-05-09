var express = require('express')
var mongoClient = require('mongodb').MongoClient
var ejs = require('ejs')
var bodyParser = require('body-parser')
var urlencoderpares = bodyParser.urlencoded({extended:false})
var app = express()

mongoClient.connect('mongodb://127.0.0.1/myempdb',function(err,db){
	if(!err){
		console.log("you have been connected\n");
		app.use(express.static('public'))
		app.use(bodyParser.json())
		
		app.get('/',function(req,res){
			res.send("<h1>Welcome</h1>")
		})
		
		app.get('/index.html',function(req,res){
			res.sendFile(__dirname+'/'+'index.html');
		})
		
		app.get('/insert.html',function(req,res){
			res.sendFile(__dirname+'/'+'insert.html');
		})
		app.post('/process_post',function(req,res){
			console.log(req.body)
			res.setHeader("Content-Type","text/html")
			console.log("Serving post request"+req.body.empname+req.body.empid)
			var empname = req.body.empname
			var empid = req.body.empid
			db.collection("employee").insert({empname:empname,empid:empid})
			res.end("Inserted"+JSON.stringify(req.body))
		})

		app.get('/update.html',function(req,res){
			res.sendFile(__dirname+"/"+"update.html")
		})
		
		app.get('/update',function(req,res){
			var empname1 = req.query.empname;
			var empid1 = req.query.empid;
			db.collection('employee',function(err,data){
				data.update({"empname":empname1},{$set:{"empid":empid1}},{multi:true},
						function(err,result){
							if(err)	console.log(err);
							else{
								res.send(result);
								console.log("EMP ID UPDATED\n");
							}
						});
				});
		});
		
		app.get('/search.html',function(req,res){
			res.sendFile(__dirname+"/"+"search.html")
		})
		
		app.get('/search',function(req,res){
			var empid = req.query.empid	
			db.collection('employee').find({empid:empid}).toArray(function(err,docs){
				if(err)	console.log(err);
				else{
					res.status(200).json(docs);
				}
			});
		});
		
		app.get('/delete.html',function(req,res){
                        res.sendFile(__dirname+"/"+"delete.html")
                })

                app.get('/delete',function(req,res){
                        var empid2 = req.query.empid;
                        db.collection('employee',function(err,data){
                                data.remove({"empid":empid2},
                                                function(err,result){
                                                        if(err) console.log(err);
                                                        else{
                                                                res.send(result);
                                                                console.log("EMP ID DELETED\n");
                                                        }
                                                });
                                });
                });

		app.get('/display',function(req,res){
			db.collection('employee').find().sort({empname:1}).toArray(function(err,i){
				if(err) console.log(err);
				else{
					res.render('disp.ejs',{employees:i})
				}
				})		
		})
		
	var server = app.listen(5000,function(){
		var host = server.address().address
		var port = server.address().port
		console.log("Listening at %s %s",host,port)
	})
}
else{
	console.log("Errr");	
	db.close();
}
});
	


		

