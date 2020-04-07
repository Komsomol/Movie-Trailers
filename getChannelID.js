//jshint esversion:6

// env vars
require('dotenv').config();

const got = require('got');
const moment = require('moment');
const apiKey = process.env.YT_API_KEY;
const debug = true;

const getter = url => {
	return new Promise(function (resolve, reject) {
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
	const channelIdCall =
		'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=' +
		channelID +
		'&key=' +
		apiKey +
		'';

	getter(channelIdCall).then(function (response) {
		if (debug) console.log(response);
	});
};

// const getChannelDetails = (channelID, channelName) => {
// 	const channelIdCall =
// 		'https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=' +
// 		channelID +
// 		'&key=' +
// 		apiKey +
// 		'';

// 	getter(channelIdCall).then(function(response) {
// 		if (debug) console.log(response);
// 	});
// };

getChannelDetails('DespicableMeMovie', 'DespicableMeMovie');

// https://www.googleapis.com/youtube/v3/channels?id=UCkQCQhMF5hmR-X1Ij48u6BQ&key=AIzaSyBX1pXGaVxOflzPwaQ22vCJEoWu-4rrav0&part=snippet,contentDetails,statistics

// https://www.googleapis.com/youtube/v3/channels?id=UCkQCQhMF5hmR-X1Ij48u6BQ&key=AIzaSyAUBdvQzdKVOvOT9w33zK5Y7YwNxKFl9Lc&part=snippet,contentDetails,statistics