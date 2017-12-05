//jshint esversion:6
// let x = ["Accident Man Trailer - On Blu-ray & Digital 2/6", "El Chapo - Season 2 | Official Trailer [HD] | Netflix", "Love, Simon | Official Trailer [HD] | 20th Century FOX"];
const moment = require('moment');


// for (var i = 0; i < x.length; i++) {
// 	if(x[i].toLowerCase().indexOf("blu-ray") > -1){
// 		// console.log("found ",x[i]);
// 		x.splice(x[i],1);
// 	}

// 	if(x[i].toLowerCase().indexOf("season") > -1 ){
// 		x.splice(x[i],1);
// 	}
// }

// console.log("new Array ", x);
var data = [ { name: 'Jurassic World: Fallen Kingdom - Trailer Thursday (Awesome) (HD)',
	date: 'Tuesday, December 5, 2017 5:00 AM',
	dateString: moment.utc("2017-12-05T05:00:51.000+00:00"),
	link: 'uBHTIiBmAzc',
	thumbnail: 'https://i.ytimg.com/vi/uBHTIiBmAzc/hqdefault.jpg' },
  { name: 'Wormwood | Official Trailer [HD] | Netflix',
	date: 'Monday, December 4, 2017 6:00 PM',
	dateString: moment.utc("2017-12-04T18:00:06.000+00:00"),
	link: 'b01DL8DTUGM',
	thumbnail: 'https://i.ytimg.com/vi/b01DL8DTUGM/hqdefault.jpg' },
  { name: 'Jurassic World: Fallen Kingdom - Trailer Thursday (Run) (HD)',
	date: 'Monday, December 4, 2017 12:41 AM',
	dateString: moment.utc("2017-12-04T00:41:00.000+00:00"),
	link: '266EI7hdjFs',
	thumbnail: 'https://i.ytimg.com/vi/266EI7hdjFs/hqdefault.jpg' },
  { name: 'Black Mirror - Metalhead | Official Trailer [HD] | Netflix',
	date: 'Sunday, December 3, 2017 11:00 AM',
	dateString: moment.utc("2017-12-03T11:00:04.000+00:00"),
	link: 'xejjA2AFO5I',
	thumbnail: 'https://i.ytimg.com/vi/xejjA2AFO5I/hqdefault.jpg' },
  { name: 'Midnight Sun | Official Trailer | In Theaters March 23',
	date: 'Friday, December 1, 2017 6:00 PM',
	dateString: moment.utc("2017-12-01T18:00:06.000+00:00"),
	link: 'fEskVQgtwaI',
	thumbnail: 'https://i.ytimg.com/vi/fEskVQgtwaI/hqdefault.jpg' },
  { name: 'Black Mirror - Hang the DJ | Official Trailer [HD] | Netflix',
	date: 'Friday, December 1, 2017 2:00 PM',
	dateString: moment.utc("2017-12-01T14:00:03.000+00:00"),
	link: 'e5N_Tq1EtRQ',
	thumbnail: 'https://i.ytimg.com/vi/e5N_Tq1EtRQ/hqdefault.jpg' },
  { name: 'Acts of Violence (2018 Movie) – Official Trailer – Bruce Willis',
	date: 'Thursday, November 30, 2017 8:08 PM',
	dateString: moment.utc("2017-11-30T20:08:33.000+00:00"),
	link: 'j3fL63AKrmU',
	thumbnail: 'https://i.ytimg.com/vi/j3fL63AKrmU/hqdefault.jpg' },
  { name: 'Judd Apatow: The Return | Official Trailer [HD] | Netflix',
	date: 'Thursday, November 30, 2017 5:30 PM',
	dateString: moment.utc("2017-11-30T17:30:21.000+00:00"),
	link: 'jNFh1pKx-bg',
	thumbnail: 'https://i.ytimg.com/vi/jNFh1pKx-bg/hqdefault.jpg' },
  { name: 'THOROUGHBREDS - Official Trailer [HD] - In Theaters March 9, 2018',
	date: 'Thursday, November 30, 2017 4:00 PM',
	dateString: moment.utc("2017-11-30T16:00:33.000+00:00"),
	link: 'TPcV_3D3V2A',
	thumbnail: 'https://i.ytimg.com/vi/TPcV_3D3V2A/hqdefault.jpg' },
  { name: 'ALL THE MONEY IN THE WORLD - Official Trailer (HD)',
	date: 'Wednesday, November 29, 2017 8:00 PM',
	dateString: moment.utc("2017-11-29T20:00:53.000+00:00"),
	link: 'KXHrCBkIxQQ',
	thumbnail: 'https://i.ytimg.com/vi/KXHrCBkIxQQ/hqdefault.jpg' },
  { name: 'Killing For Love – Official Trailer I HD I Sundance Selects',
	date: 'Wednesday, November 29, 2017 6:21 PM',
	dateString: moment.utc("2017-11-29T18:21:10.000+00:00"),
	link: 'CNOaa0k9qDs',
	thumbnail: 'https://i.ytimg.com/vi/CNOaa0k9qDs/hqdefault.jpg' },
  { name: 'Wonder (2017 Movie) Official TV Spot - “Wondrous” – Julia Roberts, Owen Wilson',
	date: 'Wednesday, November 29, 2017 5:00 PM',
	dateString: moment.utc("2017-11-29T17:00:50.000+00:00"),
	link: 'r6GK0r6Jj1U',
	thumbnail: 'https://i.ytimg.com/vi/r6GK0r6Jj1U/hqdefault.jpg' },
  { name: 'Cable Girls - Season 2 | Official Trailer [HD] | Netflix',
	date: 'Wednesday, November 29, 2017 2:00 PM',
	dateString: moment.utc("2017-11-29T14:00:05.000+00:00"),
	link: 'fj18vB3BKBM',
	thumbnail: 'https://i.ytimg.com/vi/fj18vB3BKBM/hqdefault.jpg' },
  { name: 'Marvel Studios\' Avengers: Infinity War Official Trailer',
	date: 'Wednesday, November 29, 2017 1:26 PM',
	dateString: moment.utc("2017-11-29T13:26:24.000+00:00"),
	link: '6ZfuNTqbHE8',
	thumbnail: 'https://i.ytimg.com/vi/6ZfuNTqbHE8/hqdefault.jpg' },
  { name: 'Black Mirror - Black Museum | Official Trailer [HD] | Netflix',
	date: 'Wednesday, November 29, 2017 11:00 AM',
	dateString: moment.utc("2017-11-29T11:00:03.000+00:00"),
	link: 'CV0J3Bq3BIc',
	thumbnail: 'https://i.ytimg.com/vi/CV0J3Bq3BIc/hqdefault.jpg' },
  { name: 'Marvel\'s Runaways - Episode 4 Teaser',
	date: 'Wednesday, November 29, 2017 2:00 AM',
	dateString: moment.utc("2017-11-29T02:00:04.000+00:00"),
	link: 'mn_SFu6pcnE',
	thumbnail: 'https://i.ytimg.com/vi/mn_SFu6pcnE/hqdefault.jpg' },
  { name: 'Love, Simon | Official Trailer [HD] | 20th Century FOX',
	date: 'Tuesday, November 28, 2017 9:28 PM',
	dateString: moment.utc("2017-11-28T21:28:53.000+00:00"),
	link: 'ykHeGtN4m94',
	thumbnail: 'https://i.ytimg.com/vi/ykHeGtN4m94/hqdefault.jpg' },
  { name: 'Accident Man Trailer - On Blu-ray & Digital 2/6',
	date: 'Tuesday, November 28, 2017 8:22 PM',
	dateString: moment.utc("2017-11-28T20:22:41.000+00:00"),
	link: 'ODmJXjcRzG0',
	thumbnail: 'https://i.ytimg.com/vi/ODmJXjcRzG0/hqdefault.jpg' },
  { name: 'Avengers: Infinity War Trailer Tease',
	date: 'Tuesday, November 28, 2017 5:09 PM',
	dateString: moment.utc("2017-11-28T17:09:22.000+00:00"),
	link: '3VbHg5fqBYw',
	thumbnail: 'https://i.ytimg.com/vi/3VbHg5fqBYw/hqdefault.jpg' },
  { name: 'PADDINGTON 2 - Full US Trailer',
	date: 'Tuesday, November 28, 2017 5:00 PM',
	dateString: moment.utc("2017-11-28T17:00:03.000+00:00"),
	link: 'sw7RElt-SvE',
	thumbnail: 'https://i.ytimg.com/vi/sw7RElt-SvE/hqdefault.jpg' },
  { name: 'El Chapo - Season 2 | Official Trailer [HD] | Netflix',
	date: 'Tuesday, November 28, 2017 3:00 PM',
	dateString: moment.utc("2017-11-28T15:00:04.000+00:00"),
	link: 'zeq1cBzgnzA',
	thumbnail: 'https://i.ytimg.com/vi/zeq1cBzgnzA/hqdefault.jpg' },
  { name: 'Craig Ferguson: Tickle Fight | Official Trailer [HD] | Netflix',
	date: 'Monday, November 27, 2017 4:31 PM',
	dateString: moment.utc("2017-11-27T16:31:11.000+00:00"),
	link: 'hYY_GOu79IE',
	thumbnail: 'https://i.ytimg.com/vi/hYY_GOu79IE/hqdefault.jpg' },
  { name: 'Black Mirror - Crocodile | Official Trailer [HD] | Netflix',
	date: 'Sunday, November 26, 2017 10:00 PM',
	dateString: moment.utc("2017-11-26T22:00:01.000+00:00"),
	link: 'd-NCySETRIc',
	thumbnail: 'https://i.ytimg.com/vi/d-NCySETRIc/hqdefault.jpg' },
  { name: 'Black Mirror - Crocodile | Official Trailer [HD] | Netflix',
	date: 'Sunday, November 26, 2017 9:59 PM',
	dateString: moment.utc("2017-11-26T21:59:36.000+00:00"),
	link: '1HuPDkma-yA',
	thumbnail: 'https://i.ytimg.com/vi/1HuPDkma-yA/hqdefault.jpg' } ];

// console.log(data);
// console.log(typeof data);
var holder = [];

for (var k in data) {
	console.log(k);
	holder.push( data[k] );
}


console.log(typeof holder);

