// jshint esversion: 6

const got = require('got');
const moment = require('moment');

// do not remove. if removed everything explodes?
let channelId;
const apiKey = process.env.YT_API_KEY;
const debug = false;

const checkDateRange = function(ISODate) {
	// today
	let date = moment()
		.utc()
		.format('YYYY-MM-DD');
	// console.log("TODAY IS ",date);
	// 8 days ago
	let diff = moment(date)
		.subtract(10, 'd')
		.format('YYYY-MM-DD');

	// date we get from API
	let dateFromAPI = moment(ISODate)
		.utc()
		.format('YYYY-MM-DD');

	// range
	let fallsinrange = moment(dateFromAPI).isBetween(diff, date, null, '(]');

	return fallsinrange;
};

const getter = url => {
	return new Promise(function(resolve, reject) {
		got(url)
			.then(response => {
				resolve(response.body);
			})
			.catch(error => {
				if (debug) console.log(error);
				reject(error);
			});
	});
};

const getChannelDetails = (channelID, channelName) => {
	if (debug) console.log('getChannelDetails =>', channelID);
	return new Promise((resolve, reject) => {
		const channelIdUrl =
			'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=' +
			channelID +
			'&channelId=' +
			channelID +
			'&key=' +
			apiKey +
			'';
		getter(channelIdUrl).then(function(response) {
			if (debug) console.log(response);
			let data = JSON.parse(response);

			let channelID = data.items[0].id;

			let uploadsURL = data.items[0].contentDetails.relatedPlaylists.uploads;

			resolve({ channelID, uploadsURL, channelName });
		});
	});
};

const getVideosFromChannel = (channelID, uploadsID, channelName) => {
	if (debug) console.log('getVideosFromChannel =>', channelID, uploadsID);
	return new Promise((resolve, reject) => {
		const videosurl =
			'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=' +
			uploadsID +
			'&&channelId=' +
			channelId +
			'&key=' +
			apiKey +
			'';
		getter(videosurl).then(function(response) {
			// if(debug)console.log(response);
			let data = JSON.parse(response);
			resolve(data, channelName);
		});
	});
};

// compare titles
const getTrailersOnly = (file, channelName) => {
	// console.log(file.items[0].snippet.title);
	return new Promise((resolve, reject) => {
		let videos = [];
		for (var i = 0; i < file.items.length; i++) {
			// gets any results that have the word trailer, teaser or tv spot
			if (
				file.items[i].snippet.title.toLowerCase().indexOf('trailer') > -1 ||
				file.items[i].snippet.title.toLowerCase().indexOf('teaser') > -1 ||
				file.items[i].snippet.title.toLowerCase().indexOf('tv spot') > -1
			) {
				if (checkDateRange(file.items[i].snippet.publishedAt)) {
					// console.log(file.items[i].snippet.thumbnails.high.url);
					// console.log(file.items[i].snippet.title , file.items[i].snippet.publishedAt);
					if (
						file.items[i].snippet.title.toLowerCase().indexOf('blu-ray') > -1
					) {
						// do nothing
					} else if (
						file.items[i].snippet.title.toLowerCase().indexOf('season') > -1
					) {
						// do nothing
					} else if (
						file.items[i].snippet.title.toLowerCase().indexOf('episode') > -1
					) {
						// do nothing
					} else {
						var obj = {};
						obj.channel = channelName;
						obj.name = file.items[i].snippet.title;
						obj.date = moment(file.items[i].snippet.publishedAt)
							.utc()
							.format('LLLL');
						obj.dateString = moment(file.items[i].snippet.publishedAt).utc();
						obj.link = file.items[i].snippet.resourceId.videoId;
						obj.thumbnail = file.items[i].snippet.thumbnails.high.url;
						videos.push(obj);
					}
				}
			}
		}
		// console.log(videos);
		resolve(videos);
	});
};

// channelIDs passed in from getContent
const returnResults = (channelID, channelName) => {
	if (debug) console.log(channelID, channelName);
	// Multiple steps need to take place so I make a promise
	return new Promise((resolve, reject) => {
		// Uses the channelID to return the Uploads endpoint
		getChannelDetails(channelID, channelName).then(data => {
			// Grabs all videos for a channel id, and upload URL
			getVideosFromChannel(data.channelID, data.uploadsURL, channelName).then(
				videos => {
					// Gets only videos that are 10 days old and are trailer/teaser
					getTrailersOnly(videos, channelName).then(results => {
						// returns this data
						resolve(results);
					});
				}
			);
		});
	});
};

module.exports = returnResults;
