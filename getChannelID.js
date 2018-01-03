//jshint esversion:6

const got = require('got');
const moment = require('moment');
const apiKey = process.env.YT_API_KEY;
const debug = true;

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
	const channelIdCall =
		'https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=' +
		channelID +
		'&key=' +
		apiKey +
		'';

	getter(channelIdCall).then(function(response) {
		if (debug) console.log(response);
	});
};

getChannelDetails('Kinolorber', 'kinolorber');
