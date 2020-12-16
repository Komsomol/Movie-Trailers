require("dotenv").config();
const apiKey = process.env.YT_API_KEY;
const fetch = require('node-fetch'); 

const getChannelDetails = async (channelID, channelName) => {
  const channelIdUrl =
    "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=" +
    channelID +
    "&channelId=" +
    channelID +
    "&key=" +
    apiKey +
    "";
  try {
    const res = await fetch(channelIdUrl);
    const data = await res.json();
    let channelID = data.items[0].id;
    let uploadsURL = data.items[0].contentDetails.relatedPlaylists.uploads;
    return { channelID, uploadsURL, channelName };
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = getChannelDetails;