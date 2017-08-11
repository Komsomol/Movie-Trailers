// jshint esversion:6

// Basic Express set up
const express = require('express');
const app = express();
const getcontent = require('./hitAPi');

// Body parser to recieve JSON data
const bodyParser = require('body-parser'); 

// Express Port assignment
const port = process.env.PORT || 3000;

// Set bodyparsers to allow JSON 
app.set('views', './public');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve files from the static directory /public
app.use(express.static('public'));

app.get('/',function(req,res){
	// res.send('Hello!');
	getcontent(function(data){
		console.log(data);
		res.render('index', {  
			data: data
		});
	});
});

// listen on port that was defined
app.listen(port, function(){
	console.log('app listneting on:', port);
});