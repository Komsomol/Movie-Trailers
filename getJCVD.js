//jshint esversion:6

const got = require('got');

const catURL = 'https://www.reddit.com/r/JCVD/top.json';

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

const getCats = () => {
	getter(catURL).then((result)=>{
		// console.log(typeof result);
		var jsonData = JSON.parse(result);

		// getVideosOnly(jsonData);
		console.dir(jsonData.data, { depth: null, colors: true });
	}).catch((e)=>{
		console.log(e);
	});
};

const getVideosOnly = (data) => {
	console.log(data);

	for (var i = 0; i < data.length; i++) {
		console.log(data[i].domain);
	}
};

getCats();