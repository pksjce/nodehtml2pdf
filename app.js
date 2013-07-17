var express = require('express');
var path = require('path');
var phantom = require('phantom')
var app = express();
var fs = require('fs');
var ejs = require('ejs');
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

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
