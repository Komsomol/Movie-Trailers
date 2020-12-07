// env vars
const request = require('request');
const _url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=UUF9imwPMSGz4Vq1NiTWCC7g&channelId=UCF9imwPMSGz4Vq1NiTWCC7g&key=AIzaSyAQjQCIyrGjS3fvik-erngVcrcjynR5jXw";

console.log(_url);

request(_url, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body);
});
