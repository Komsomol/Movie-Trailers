// jshint esversion:6
const getAllContent = require('./hitAPI');
const fs = require('fs');
const data = require('./data/data.js');
var moment = require('moment');

// getAllContent(function(data){
// 	// console.log(data);
// 	var flat = [].concat.apply([],data);

// 	// console.log(flat);

// 	// for (var i = 0; i < flat.length; i++) {
// 	// 	console.log(flat[i]);
// 	// }
// 	let holder = JSON.stringify(flat, null, 2);
// 	fs.writeFileSync('data/data.json', holder);
// });

// console.log(data);

// for (var i = 0; i < data.length; i++) {
// 	console.log(data[i].date,' === ',data[i].name);

// }
// let sorted = data.sort((a,b) => { 
// 	return b.date - a.date;
// });

// // console.log(sorted);

// for (var i = 0; i < sorted.length; i++) {
// 	console.log(sorted[i].date,' === ',sorted[i].name);

// }

getAllContent(function(data){
	console.log(data);
});