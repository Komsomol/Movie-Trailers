require("dotenv").config();
const getChannelDetails = require("./getChannelDetails");
const getVideosFromChannel = require("./getVideosFromChannel");
const filterTrailers = require("./filterTrailers.improved");
const logger = require("./utils/logger");

const getData = async (channelID, channelName) => {
  try {
    const getChan = await getChannelDetails(channelID, channelName);
    const getVids = await getVideosFromChannel(
      getChan.channelID,
      getChan.uploadsURL
    );
    const trailers = filterTrailers(getVids, channelName);
    return trailers;

  } catch (error) {
    logger.error(`Error in getData for ${channelName}:`, error);
    return [];
  }
};

module.exports = getData;
