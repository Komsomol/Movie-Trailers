// env vars


const request = require('request');
const _apiKey = "AIzaSyAl2yL3t0ayAxZcfeTGQzKTCrcEICllQT0";
const _channelName = 'UCbxjDfYwfF8RjYBp5htJ38Q';

const _url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=${_channelName}&key=${_apiKey}`;

const _url2 = `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=${_channelName}&maxResults=25&key=${_apiKey}`;

console.log(_url2);

request(_url2, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body);
});
