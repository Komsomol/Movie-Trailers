// jshint esversion: 6
// require our module
const getTrailers = require('./getTrailers');

const sendgrid = require('sendgrid')(
	process.env.SEND_GRID_USER,
	process.env.SEND_GRID_PASSWORD
);

const getData = () => {
	getTrailers('joblomovienetwork').then(function(data) {
		console.log('Data Recieved');

		let str = 'Hi! <br> These are the new trailers from JbloTrailers<br><br>';
		for (var i = 0; i < data.length; i++) {
			// console.log(data[i].name + '<br>' + data[i].link + '<br><br>');
			str +=
				data[i].name +
				'<br>' +
				'Published on: ' +
				data[i].date +
				'<br>' +
				'https://www.youtube.com/watch?v=' +
				data[i].link +
				'<br><br>';
		}

		const helper = require('sendgrid').mail;
		const fromEmail = new helper.Email('trailers@thisistommy.com');
		const toEmail = new helper.Email('farhad@thisistommy.com');
		const subject = 'Stats Video';
		const content = new helper.Content('text/html', str);
		const mail = new helper.Mail(fromEmail, subject, toEmail, content);

		const sg = require('sendgrid')(process.env.SEND_GRID_API_KEY);

		const request = sg.emptyRequest({
			method: 'POST',
			path: '/v3/mail/send',
			body: mail.toJSON(),
		});

		sg.API(request, function(error, response) {
			if (error) {
				console.log('Error response received');
			}
			console.log(response.statusCode);
			console.log(response.body);
			console.log(response.headers);
		});
	});
};

module.exports = getData;
// getData();
