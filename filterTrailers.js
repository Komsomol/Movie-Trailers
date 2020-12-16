const moment = require("moment");

const checkDateRange = function (ISODate) {
  // today
  let date = moment().utc().format("YYYY-MM-DD");
  // console.log("TODAY IS ",date);
  // 8 days ago
  let diff = moment(date).subtract(10, "d").format("YYYY-MM-DD");

  // date we get from API
  let dateFromAPI = moment(ISODate).utc().format("YYYY-MM-DD");

  // range
  let fallsinrange = moment(dateFromAPI).isBetween(diff, date, null, "(]");

  return fallsinrange;
};

const getTrailersOnly = (file, channelName) => {
  // console.log(file.items[0].snippet.title);
  let videos = [];
  for (var i = 0; i < file.items.length; i++) {
    // gets any results that have the word trailer, teaser or tv spot
    // console.log(file.items[i].snippet.title, channelName);
    if (
      file.items[i].snippet.title.toLowerCase().indexOf("trailer") > -1 ||
      file.items[i].snippet.title.toLowerCase().indexOf("teaser") > -1 ||
      file.items[i].snippet.title.toLowerCase().indexOf("tv spot") > -1
    ) {
      if (checkDateRange(file.items[i].snippet.publishedAt)) {
        if (file.items[i].snippet.title.toLowerCase().indexOf("blu-ray") > -1) {
          // do nothing
        } else if (
          file.items[i].snippet.title.toLowerCase().indexOf("season") > -1
        ) {
          // do nothing
        } else if (
          file.items[i].snippet.title.toLowerCase().indexOf("episode") > -1
        ) {
          // do nothing
        } else {
          var obj = {};
          obj.channel = channelName;
          obj.name = file.items[i].snippet.title;
          obj.date = moment(file.items[i].snippet.publishedAt)
            .utc()
            .format("LLLL");
          obj.dateString = moment(file.items[i].snippet.publishedAt).utc();
          obj.link = file.items[i].snippet.resourceId.videoId;
          obj.thumbnail = file.items[i].snippet.thumbnails.high.url;
          videos.push(obj);
        }
      }
    }
  }
  // console.log(videos);
  return(videos);
};

module.exports = getTrailersOnly;