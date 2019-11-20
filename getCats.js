//jshint esversion:6

import got from 'got';

const catURL = 'https://www.reddit.com/r/cats.json';

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
	getter(catURL).then((data)=>{
		console.log(typeof data);
		var jsonData = JSON.parse(data);
		console.dir(jsonData, { depth: null, colors: true });
	}).catch((e)=>{
		console.log(e);
	});
};

getCats();