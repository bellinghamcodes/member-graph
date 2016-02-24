'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');

const apiToken = process.env.SLACK_API_TOKEN;

https.get(`https://slack.com/api/users.list?token=${apiToken}&pretty=1`, response => {
	let data = '';
	response.on('data', chunk => {
		data += chunk;
	});
	response.on('end', () => processData(data));
});

function processData(data) {
	console.log('Transforming...')

	const parsed = JSON.parse(data);
	const result = {
		nodes: parsed.members
			.filter(x => !x.is_bot && x.id !== 'USLACKBOT')
			.map(x => ({
				name: x.name,
				real_name: x.real_name,
				id: x.id,
				img: x.profile.image_24,
			}))
	};

    fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(result, null, 2), err => {
        if (err) throw err;

        console.log('Done.');
    });
}
