// jshint esversion:6
// checkDateRange('2017-07-31T16:51:39.000Z');
var moment = require('moment');

const checkDateRange = function(ISODate){
	// let date = moment(ISODate).utc().format('YYYY-MM-DD');
	// TODAY
	let date = moment().utc().format('YYYY-MM-DD');
	// 7 DAYS FROM TODAY
	let diff = moment(date).subtract(7,'d').format('YYYY-MM-DD');
	// DOES THIS DATE FALL INTO THIS RANGE?
	let dateFromAPI = moment(ISODate).utc().format('YYYY-MM-DD');
	
	let fallsinrange = moment(dateFromAPI).isBetween(diff, date, null, '(]');
	console.log("TODAY date = ",date);
	console.log("7 days from TODAY = ",diff);
	console.log("Date from API = ",dateFromAPI);
	console.log("Falls within range? = ",fallsinrange);
	
	return fallsinrange;
};

console.log(checkDateRange('2017-08-10T14:13:08.000Z'));

// console.log(checkDateRange('2017-07-24T16:27:24.000Z'));


// module.exports = checkDateRange;