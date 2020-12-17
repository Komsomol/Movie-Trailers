const channelList = require("./data/channels");
const getData = require("./getData");
const moment = require("moment");
require("dotenv").config();
const fetch = require('node-fetch'); 
const apiKey = process.env.YT_API_KEY;

const hitAPI = async (channelID, channelName) =>{
  try {
    let result = await getData(channelID, channelName);
    var o = {};
    o = result;
    return(o);
  } catch (error) {
    return error;
  }
}

const checkIfYTkeyisValid = async () =>{
  const query = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=YouTube+Data+API&type=video&key=${apiKey}`;
  try {
    const res = await fetch(query);
    const data = await res.json();
    if(data.error){
      return ({apiValid: false, error: data});
    } else {
      return ({apiValid: true, error: null});
    }
  } catch (error) {
    console.log(error);
    return ({apiValid: false, error: error});
  }
}

const getContent = async () => {
  // console.log(checkIfYTkeyisValid())
  let result = await checkIfYTkeyisValid()
  // console.log(result);
  // console.log(result.apiValid);
  if(result.apiValid === true){
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
  } else {
    return (result)
  }
  
};

module.exports = getContent;

// getContent();