//jshint esversion:6

const channelList = require('./channels');
const getVideos = require('./promiseAll');

const getAllContent = function(callback){
	var promises = [];

	const hitAPI = function(channelURL,channelName){
			// var c = [];
			return new Promise (function(resolve, reject){
				getVideos(channelURL).then(function(data){
				// if(data.length > 0){
					console.log(data);
					// console.log({channelName, data});
					var o = {};
					o.channel = channelName;
					o.data = data;

					// c.push(o);
					resolve(o);
					// resolve(data,channelName);
				// }
			});
		});
	};

	for (var i = 0; i < channelList.length; i++) {
		promises.push(hitAPI(channelList[i].channelURL, channelList[i].name));
	}

	Promise.all(promises).then(function(dataSet) {

		var filter = dataSet.filter(function(item){
			// console.log(item.data.length);
			if(item.data.length > 0){
				return item;
			}
		});
		
		callback(filter);
		// console.log(cleanup);

		// console.log(dataSet);
	}, function(err) {
		// error occurred
	});
};

module.exports = getAllContent;

// getAllContent();


