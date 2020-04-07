// env vars
require('dotenv').config();
const request = require('request');

const _apiKey = process.env.YT_API_KEY;
const _channelName = 'UCbxjDfYwfF8RjYBp5htJ38Q'
const _url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=${_channelName}&key=${_apiKey}`;



const _url2 = `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=${_channelName}&maxResults=25&key=${_apiKey}`;
console.log(_url2);
request(_url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.url);
    console.log(body.explanation);
});