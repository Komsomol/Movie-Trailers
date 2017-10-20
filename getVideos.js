// jshint esversion: 6

const got = require('got');
const fs = require('fs');
const moment = require('moment');

// do not remove. if removed everything explodes?
const channelId = 'UCRX7UEyE8kp35mPrgC2sosA';
const apiKey = 'AIzaSyBX1pXGaVxOflzPwaQ22vCJEoWu-4rrav0';
// const apiKey = process.env.YT_API_KEY;
const debug = false;

const checkDateRange = function(ISODate){
	// today
	let date = moment().utc().format('YYYY-MM-DD');
	// console.log("TODAY IS ",date);
	// 8 days ago
	let diff = moment(date).subtract(10,'d').format('YYYY-MM-DD');
	
	// date we get from API
	let dateFromAPI = moment(ISODate).utc().format('YYYY-MM-DD');
	
	// range
	let fallsinrange = moment(dateFromAPI).isBetween(diff, date, null, '(]');

	return fallsinrange;
};

const getter = (url) => {
	return new Promise(function(resolve, reject){
		got(url)
		.then(response => {
			resolve(response.body);
		})
		.catch(error => {
			reject(error);
		});
	});
};

const getChannelDetails = channelID => {
	if(debug) console.log("getChannelDetails =>",channelID);
	return new Promise((resolve, reject) => {
		const channelIdUrl ='https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id='+channelID+'&channelId='+channelID+'&key='+apiKey+'';
		getter(channelIdUrl).then(function(response){
			// if(debug) console.log(response);

			// console.log(typeof response);

			let data = JSON.parse(response);
			
			// console.log(data.items[0].contentDetails.relatedPlaylists.uploads);
			
			let channelID = data.items[0].id;
			
			let uploadsURL = data.items[0].contentDetails.relatedPlaylists.uploads;

			// let data = JSON.parse(response);
			// let channelID = data.items[0].id;
			// let uploadsID = data.items[0].contentDetails.relatedPlaylists.uploads;
			resolve({channelID, uploadsURL});
		});
	});
};

const getVideosFromChannel = (channelID, uploadsID) =>{
	if(debug) console.log("getVideosFromChannel =>", channelID, uploadsID);
	return new Promise((resolve, reject) =>{
			const videosurl = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId='+uploadsID+'&&channelId='+channelId+'&key='+apiKey+'';
			getter(videosurl).then(function(response){
				// if(debug)console.log(response);
				let data = JSON.parse(response);
				resolve(data);
		});
	});
};

// compare titles
const getTrailersOnly = file =>{
	// console.log(file.items[0].snippet.title);
	return new Promise((resolve,reject) =>{
		let videos = [];
		for (var i = 0; i < file.items.length; i++) {
			if(file.items[i].snippet.title.toLowerCase().indexOf('trailer') > -1 || file.items[i].snippet.title.toLowerCase().indexOf('teaser') > -1 || file.items[i].snippet.title.toLowerCase().indexOf('tv spot') > -1 ){
				if(checkDateRange(file.items[i].snippet.publishedAt)){
					// console.log(file.items[i].snippet.thumbnails.high.url);
					// console.log(file.items[i].snippet.title , file.items[i].snippet.publishedAt);
					var obj = {};
					obj.name = file.items[i].snippet.title;
					obj.date = parseInt(moment(file.items[i].snippet.publishedAt).utc().format('DD'),10);
					obj.link = file.items[i].snippet.resourceId.videoId;
					obj.thumbnail = file.items[i].snippet.thumbnails.high.url;
					videos.push(obj);
				}
			}
		}
		// console.log(videos);
		resolve(videos);
	});
};


// console.log(getChannelDetails(channelName));

const returnResults = function(channelID){
	// console.log("returnResults =>",channelID);
	return new Promise(function(resolve, reject){
		getChannelDetails(channelID).then(function(data){
			// console.log(data);
			getVideosFromChannel(data.channelID,data.uploadsURL).then(function(videos){
				// console.log(videos);
				getTrailersOnly(videos).then(function(results){
					resolve(results);
				});
			});
		});
	});
};


// const test = function(test){

// };
// 
module.exports = returnResults;

// test function
// returnResults('UCvC4D8onUfXzvjTOM-dBfEA');