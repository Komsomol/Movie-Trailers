//jshint esversion:6

const channelList = require('./channels');
const getVideos = require('./promiseAll');

const debug = true;

const getAllContent = function(callback){
	var promises = [];

	const hitAPI = function(channelID,channelName){
			// var c = [];
			return new Promise (function(resolve, reject){
				getVideos(channelID).then(function(data){
				// if(data.length > 0){
					if(debug) console.log(channelName);
					if(debug) console.log({channelName, data});
					var o = {};
					o.channel = channelName;
					o.data = data;
					if(debug) console.log(o);
					// c.push(o);
					resolve(o);
					// resolve(data,channelName);
				// }
			});
		});
	};

	for (var i = 0; i < channelList.length; i++) {
		// console.log(channelList[i].channelID);
		promises.push(hitAPI(channelList[i].channelID, channelList[i].name));
	}

	Promise.all(promises).then(function(dataSet) {

		var filter = dataSet.filter(function(item){
			// if(debug) console.log(item.data.length);
			if(item.data.length > 0){
				return item;
			}
		});
		
		callback(filter);

		// if(debug) console.log(dataSet);
	}, function(err) {
		// error occurred
	});
};

module.exports = getAllContent;

// getAllContent();


