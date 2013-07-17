var express = require('express');
var path = require('path');
var phantom = require('phantom')
var app = express();
var fs = require('fs');
var ejs = require('ejs');
var aws = require('aws-sdk');

aws.config.loadFromPath('./config.json');
var s3 = new aws.s3();

app.use(express.bodyParser());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function(req, res){
	res.render('index');
});

app.post('/print', function(req, res){
	var queryParam = req.body.param;
	console.log(queryParam);
	phantom.create(function(ph){
	  ph.createPage(function(page) {
	  	var compiled = ejs.compile(fs.readFileSync(__dirname + "/views/print.ejs", 'utf8'));
	  	var html = compiled({param:queryParam});	  	
	  	return page.set('content', html, function(){
	  		return page.render('google.pdf', function(){
	  			console.log('rendered');
	  			ph.exit();
	  		});
	  	});
	  });
	});	
});

fs.readFile('google.pdf', function(err, data){
	s3.client.putObject({
		'Bucket':"habitstestassets",
		'Key':'google.pdf',
		'body': data
	}).done(function(resp){
		console.log('Updated');
	});	
})



var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
