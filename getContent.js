const channelList = require("./channels"),
  getVideos = require("./getVideos"),
  moment = require("moment"),
  debug = false;

const getContent = function (callback) {
  var promises = [];
  return new Promise((resolve, reject) => {
    const hitAPI = function (channelID, channelName) {
      // var c = [];
      return new Promise(function (resolve, reject) {
        getVideos(channelID, channelName)
          .then(function (data) {
            if (debug) console.log(channelID, channelName);

            var o = {};

            o = data;

            resolve(o);
          })
          .catch((error) => {
            // console.log("Error in getContent ", channelID, channelName);
            // console.log("Error in getContent ", error);
            reject(error);
            return;
          });
      });
    };

    for (var i = 0; i < channelList.length; i++) {
      promises.push(hitAPI(channelList[i].channelID, channelList[i].name));
    }

    Promise.all(promises).then(
      (dataSet) => {
        // removes empty arrays
        let filter = dataSet.filter((item) => {
          if (item.length > 0) {
            return item;
          }
        });

        // flattens array results
        let flatten = [].concat.apply([], filter);

        // sorts results by date
        let sorted = flatten.sort((a, b) => {
          return moment.utc(b.dateString).diff(moment.utc(a.dateString));
        });

        // console.log(sorted);
        resolve(sorted);
      },
      function (err) {
        // console.log('ERROR in getContent.js = ', err);
        reject(err);
        return;
      }
    );
  });
};

module.exports = getContent;
