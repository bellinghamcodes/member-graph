/**
 * publish-github-pages.js
 * Publishes the member graph page(s) via GitHub Pages
 *
 * Reqiures the following environment variables to be set:
 * 	 GIT_USER_EMAIL: The email address used for commit messages.
 * 	 GIT_USER_NAME:  The name used for commit messages.
 * 	 GITHUB_REPO:    The GitHub repository slug in the format <user>/<repo>
 * 	 GITHUB_TOKEN:   A GitHub personal access token with access to the 
 * 	                 repository. Can be generated from 
 * 	                 https://github.com/settings/tokens
 */

'use strict';

// Modules
const fs     = require('fs'),
      path   = require('path'),
      os     = require('os'),
      crypto = require('crypto'),
      exec   = require('child_process').exec,
      ncp    = require('ncp').ncp;

// Constants
const sources = path.resolve('./public'),
      GIT_USER_EMAIL = process.env.GIT_USER_EMAIL,
      GIT_USER_NAME  = process.env.GIT_USER_NAME,
      GITHUB_TOKEN   = process.env.GITHUB_TOKEN,
      GITHUB_REPO    = process.env.GITHUB_REPO,
      githubUrl      = 'https://'+ GITHUB_TOKEN +'@github.com/'+ GITHUB_REPO +'.git'


// Script
createTempDir()
	.then( (dir) => {
		return execPromise('git init .', dir);
	})
	.then( (dir) => {
		return execPromise('git config user.email "'+ GIT_USER_EMAIL +'"', dir);
	})
	.then( (dir) => {
		return execPromise('git config user.name "'+ GIT_USER_NAME +'"', dir);
	})
	.then( (repo) => {
		return copy(sources, repo);
	})
	.then( (copy) => {
		return execPromise('git add .', copy.dest);
	})
	.then( (repo) => {
		return execPromise('git commit -m "Adds content."', repo);
	})
	.then( (repo) => {
		return execPromise('git push --force --quiet "'+ githubUrl +'" master:gh-pages > /dev/null 2>&1', repo);
	})
	.then( (repo) => {
		return execPromise('rm -rf "'+ repo +'"');
	});

 
// Utility Functions
function createTempDir() {
	return new Promise( (resolve, reject) => {
		const dir = path.join(os.tmpdir(), 'gh-pages-' + crypto.randomBytes(16).toString('hex') );
		fs.mkdir(dir, () => { 
			resolve(dir);
		});
	});
}

function copy(src, dest) {
	return new Promise( (resolve, reject) => {
		ncp(src, dest, (error) => {
			if (error === null) {
				resolve({
					src:  src,
					dest: dest,
				});
			}
			else {
				reject(error);
			}
		});
	});
}

function execPromise(cmd, cwd) {
	return new Promise( (resolve, reject) => {
		exec(cmd, 
		{
			cwd: cwd,
		}, 
		(error, stdout, stderr) => {
    		if (error === null) {
    			resolve(cwd);
    		}
    		else {
    			reject(error);
    		}
		});
	});
}
