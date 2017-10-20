//jshint esversion:6

const channelList = require('./channels');
const getVideos = require('./getVideos');

const debug = false;

const getAllContent = function(callback){
	var promises = [];

	const hitAPI = function(channelID,channelName){
			// var c = [];
			return new Promise (function(resolve, reject){
				getVideos(channelID).then(function(data){
				// if(data.length > 0){
					// if(debug) console.log(channelName);
					// if(debug) console.log({channelName, data});
					// console.log(data);
					var o = {};
					// console.log(data);
					// o.channel = channelName;
					// o.date = data.date;
					// data.channel = channelName;
					o = data;


					// if(debug) console.log(o);
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

	Promise.all(promises).then(dataSet => {

		let filter = dataSet.filter(item =>{
			if(item.length > 0){
				return item;
			}
		});

		let flatten = [].concat.apply([],filter);

		let sorted = flatten.sort((a,b) => { 
			return b.date - a.date;
		});
		
		callback(sorted);

	}, function(err) {
		// error occurred
	});
};

module.exports = getAllContent;



