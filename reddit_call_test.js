/*jshint esversion: 6 */

const request = require('request');

const url = 'http://www.reddit.com/r/cats.json';

request(url, (error, res, body)=>{
    if(error) {
        console.log(`error => ${error} `);
    } else {
        result = JSON.parse(body);
        console.log(JSON.stringify(result,null,2))
    }
});