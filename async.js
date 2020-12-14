require("dotenv").config();


const getChannelDetails = async (channelID, channelName) => {
  // if (debug) console.log('getChannelDetails =>', channelID);

    const channelIdUrl =
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=" +
      channelID +
      "&channelId=" +
      channelID +
      "&key=" +
      apiKey +
      "";
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data
    } catch (error){
        
    }
    getter(channelIdUrl)
      .then((response) => {
        if (debug) console.log(response);
        let data = JSON.parse(response);

        let channelID = data.items[0].id;

        let uploadsURL = data.items[0].contentDetails.relatedPlaylists.uploads;

        resolve({ channelID, uploadsURL, channelName });
      })
      .catch((error) => {
        // let err = JSON.parse(error);
        console.error(error);
        reject(error);
        return;
      });

};


const returnResults = (channelID, channelName) => {
  if (debug) console.log(channelID, channelName);
  // Multiple steps need to take place so I make a promise
  return new Promise((resolve, reject) => {
    // Uses the channelID to return the Uploads endpoint
    getChannelDetails(channelID, channelName);
      
};

module.exports = returnResults;
