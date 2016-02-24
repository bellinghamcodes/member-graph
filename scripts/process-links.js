'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

fs.readFile(path.join(__dirname, '../data/users.json'), (err, data) => {
	if (err) throw err;

	const users = JSON.parse(data);
	const userIds = users.nodes.reduce((acc, elem, idx) => Object.assign({}, acc, { [elem.name]: idx }), {});

	fs.readFile(path.join(__dirname, '../data/links.txt'), (err, data) => {
		if (err) throw err;

		const links = yaml.safeLoad(data);

		const distinctLinks = Object.keys(links)
			.reduce(
				(acc, source) => Object.assign({},
					acc,
					{ [source]: links[source].filter(target => !acc[target] || acc[target].indexOf(source) === -1) }),
				{});

		const linkOutput = Object.keys(distinctLinks)
            .map(source => distinctLinks[source].map(target => ({
                source: userIds[source],
                target: userIds[target],
            })))
            .reduce((acc, curr) => [...acc, ...curr], []);

		const output = Object.assign({}, users, { links: linkOutput });
        fs.writeFile(path.join(__dirname,'../public/merged.json'), JSON.stringify(output, null, 2), err => {
            if (err) throw err;
            console.log('Done!');
        })
	});
});
