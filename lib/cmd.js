var path = require('path');
var url = require('url');
var exec = require('child_process').exec;

var lastTime = new Date().getTime();

module.exports = function(req, res, cb) {

  // for security
  var now = new Date().getTime();
  var _t = now - lastTime;
  if (_t < 1000*5) {
    res.end("have a rest");
    return;
  }
  lastTime = now;
	var pathname = url.parse(req.url).pathname;
	var patharr = pathname.split('/');
	patharr.shift();patharr.shift();
	switch (patharr[0]) {
		case 'pull':
			var cmdarr = [];
			cmdarr.push('cd ' + process.env.blog);
			cmdarr.push('git pull');
			var cmds = cmdarr.join(';');
      exec(cmds, function(err, stdout, stderr) {
          cb();
			    res.end(stdout);
      });
      return;
	}
	res.end('haha');
}
