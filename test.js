// jshint esversion:6
// const channelid = 'UCtlp8d4cZg2eMrVbq7vxg9w'; // STX
const channelid = 'UCvC4D8onUfXzvjTOM-dBfEA'; // FOX

const got = require('got');
// we have to find out the videos of this channel becuase STX is like wtf a channel.
const apiKey = 'AIzaSyBX1pXGaVxOflzPwaQ22vCJEoWu-4rrav0';
// const testURL = 'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&&id=UCtlp8d4cZg2eMrVbq7vxg9w&channelId=UCtlp8d4cZg2eMrVbq7vxg9w&key=AIzaSyBX1pXGaVxOflzPwaQ22vCJEoWu-4rrav0';
const moment = require('moment');

const checkDateRange = function(ISODate){
	// today
	let date = moment().utc().format('YYYY-MM-DD');
	// console.log("TODAY IS ",date);
	
	// 10 days ago
	let diff = moment(date).subtract(10,'d').format('YYYY-MM-DD');
	
	// date we get from API
	let dateFromAPI = moment(ISODate).utc().format('YYYY-MM-DD');
	
	// range
	let fallsinrange = moment(dateFromAPI).isBetween(diff, date, null, '(]');

	return fallsinrange;
};

const getter = function(url){
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

const getChannelDetails= () => {
	const videosurl = 'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id='+channelid+'&channelId='+channelid+'&key='+apiKey+'';
	getter(videosurl).then(function(resolve){
		console.log(typeof resolve);
		let response = JSON.parse(resolve);
		console.log(response.items[0].contentDetails.relatedPlaylists.uploads);
		let uploadsURL = response.items[0].contentDetails.relatedPlaylists.uploads;
		getVideosFromChannel(channelid,uploadsURL);
	}).catch(function(error){
		console.log(error);
	});
};

const getVideosFromChannel = (channelid,uploadsURL) => {
	const videosurl = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId='+uploadsURL+'&&channelId='+channelid+'&key='+apiKey+'';
	getter(videosurl).then(function(response){
		// console.log(response);
		let file = JSON.parse(response);
		getTrailersOnly(file);
	}).catch(function(error){
		console.log(error);
	});
};

const getTrailersOnly = (file) => {
	let videos = [];
		for (var i = 0; i < file.items.length; i++) {
			if(file.items[i].snippet.title.toLowerCase().indexOf('trailer') > -1 || file.items[i].snippet.title.toLowerCase().indexOf('teaser') > -1 || file.items[i].snippet.title.toLowerCase().indexOf('tv spot') > -1 ){
				// console.log(file.items[i].snippet.title , file.items[i].snippet.publishedAt);
				if(checkDateRange(file.items[i].snippet.publishedAt)){
					// console.log(file.items[i].snippet.title , file.items[i].snippet.publishedAt);
					var obj = {};
					obj.name = file.items[i].snippet.title;
					obj.date = moment(file.items[i].snippet.publishedAt).utc().format('YYYY-MM-DD');
					obj.link = file.items[i].snippet.resourceId.videoId;
					videos.push(obj);
				}
			}
		}
		console.log(videos);
};



getChannelDetails();