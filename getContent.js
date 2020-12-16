const channelList = require("./data/channels");
const getVideos = require("./getData");
const moment = require("moment");

const hitAPI = async (channelID, channelName) =>{
  try {
    let result = await getVideos(channelID, channelName);
    var o = {};
    o = result;
    return(o);
  } catch (error) {
    return error;
  }
}

const getContent = async () => {
  try {
    var promises = [];
    for (var i = 0; i < channelList.length; i++) {
      promises.push(hitAPI(channelList[i].channelID, channelList[i].name));
    }

    const result = await Promise.all(promises);
    
    let filter = result.filter((item) => {
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

    return(sorted)

  } catch (error) {
    return error;
  }
};

module.exports = getContent;