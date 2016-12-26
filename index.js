const path = require('path');
const fs = require('mz/fs');
const mkdirp = require('mkdirp');
const generateHtml = require('./dist/generateHtml.js');

function mkdir(dir, opts) {
	return new Promise(function(resolve, reject) {
		mkdirp(dir, opts, (err, made) => {
			if (err) {
				reject(err);
			} else {
				resolve(made);
			}
		});
	});
}
/*
 * @param {Object} config - optional
 * @param {String} config.outDir - output directory.
 * @param {Array} config.links - social paltforms name.
 */
function share(config) {
	config = config === undefined ? {} : config;
	let destDir = config.outDir === undefined ? 'views/partials' : config.outDir;

	out = path.resolve(process.cwd(), `${destDir}/o-share.html`);

	fs.access(destDir, fs.constants.R_OK | fs.constants.W_OK)
		.then(null, err => {
			return mkdir(destDir)
		})
		.then(() => {
			return fs.writeFile(out, generateHtml(config), 'utf8')
		})
		.then(() => {
			console.log(`${out} file is generated`);
		})
		.catch(err => {
			console.log(err);
		});
}

if (require.main === module) {
	share({
		outDir: 'partials'
	});
}

module.exports = share;