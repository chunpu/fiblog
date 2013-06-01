var path = require('path');
var url = require('url');
var exec = require('child_process').exec;

module.exports = function(req, res) {
	var pathname = url.parse(req.url).pathname;
	var patharr = pathname.split('/');
	patharr.shift();patharr.shift();
	switch (patharr[0]) {
		case 'pull':
			var cmdarr = [];
			cmdarr.push('cd ' + process.env.blog);
			cmdarr.push('dir');
			var cmds = cmdarr.join(';\n');
			console.log(cmds);

			return;
	}
	res.end('haha');
}