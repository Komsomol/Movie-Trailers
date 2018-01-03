//jshint esversion:6

const channelList = require('./channels'),
		getVideos = require('./getVideos'),
		moment = require('moment'),
		debug = true;

const getAllContent = function(callback){
	var promises = [];

	const hitAPI = function(channelID,channelName){
			// var c = [];
			return new Promise (function(resolve, reject){
				getVideos(channelID, channelName).then(function(data){
					
					if(debug) console.log(channelID, channelName);

					var o = {};
					
					o = data;

					resolve(o);
			});
		});
	};

	for (var i = 0; i < channelList.length; i++) {
		promises.push(hitAPI(channelList[i].channelID, channelList[i].name));
	}

	Promise.all(promises).then(dataSet => {

		// removes empty arrays
		let filter = dataSet.filter(item =>{
			if(item.length > 0){
				return item;
			}
		});

		// flattens array results
		let flatten = [].concat.apply([],filter);

		// sorts results by date
		let sorted = flatten.sort((a,b) => { 
			return moment.utc(b.dateString).diff(moment.utc(a.dateString));
		});
		
		console.log(sorted);
		callback(sorted);

	}, function(err) {
		console.log("ERROR in getContent.js = ", err);
	});
};

module.exports = getAllContent;
