var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var dotmp=require('./tpl.js');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-dot-commonjs-compile';

function getTemplateName(name) {
	var parts = name.split(path.sep);

	return parts[parts.length-1].replace(/\.html/i,'');
}
function readStream(stream, done) {
	var buffer = '';
	stream.on('data', function (chunk) {
		buffer += chunk;
	}).on('end', function () {
		done(null, buffer);
	}).on('error', function (error) {
		done(error);
	});
}

function gulpDotCompile() {

	var stream = through.obj(function (file, enc, callback) {
		var complete = function (error, contents) {
			if (error) {
				this.emit('error', new PluginError(PLUGIN_NAME, error));
			}
			try {
				var name = getTemplateName(file.path);
				file.contents = new Buffer(dotmp.dot(contents,name));
				this.push(file);
				return callback();
			}
			catch (exception) {
				this.emit('error', new PluginError(PLUGIN_NAME, exception));
			}
		}.bind(this);

		if (file.isBuffer()) {
			complete(null, file.contents.toString());
		} else if (file.isStream()) {
			readStream(file.contents, complete);
		}
	});
	return stream;
};

module.exports = gulpDotCompile;
