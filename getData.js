require("dotenv").config();
const getChannelDetails = require("./getChannelDetails");
const getVideosFromChannel = require("./getVideosFromChannel");
const filterTrailers = require("./filterTrailers");

const getData = async (channelID, channelName) => {
  try {
    const getChan = await getChannelDetails(channelID, channelName);
    // console.log(getChan);
    const getVids = await getVideosFromChannel(
      getChan.channelID,
      getChan.uploadsURL
    );
    // console.log(getVids);
    const trailers = filterTrailers(getVids, channelName);
    return trailers;

  } catch (error) {
    return error;
  }
};

module.exports = getData;

// console.log(returnResults( 	'UCWOA1ZGywLbqmigxE4Qlvuw', 'NewOnNetflix'));