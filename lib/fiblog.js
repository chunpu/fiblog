var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
var tpl = require('fitemp');

var fileList = require('./filelist.js');
var genBlogHash = require('./genbloghash.js');

var fiblog = {};

var $ = {
	port: 80,
	blog: {},
	template: '/template/lofter/'
};
/*
function open(vpath, cb) {
	var rpath = path.join(__dirname, '../', vpath);
	console.log(rpath);	
	fs.readFile(rpath, function(err, data) {
		cb && cb(err, data);
	});
}
*/
function v2rpath(vpath) {
	return path.join(__dirname, '../', vpath);
}

//open($.template);

module.exports = fiblog;

fiblog.start = function(blogpath) {

	// get file list
	var files = fileList(blogpath);
	//console.log(blogs);
	
	// gen blog hash
	// get a relative path, need pass the blogdir param
	$.blog = genBlogHash(files, blogpath);
	for(var key in $.blog) {
		//console.log($.blog[key].relative);
	}
	
	//console.log($.blog);

	http.createServer(function(req, res) {
	
		//res.end("success");
		var mime = {
			'.html'	:	'text/html',
			'.js'	:	'text/javascript',
			'.png'	:	'image/png',
			'.css'	:	'text/css',
			'.ico'	:	'image/x-icon',
			'.jpg'	: 	'image/jpeg',
			'.ttf'	:	'x-font-ttf'
		}
		
		var pathname = url.parse(req.url).pathname;
		var extname = path.extname(pathname);
		
		var patharr = pathname.split('/');
		patharr.shift(); // first is ''..

		if (patharr[0] === 'cmd') {
			// pre cmd
			require('./cmd.js')(req, res);
			return;
		}
		
		if (extname in mime) {
		
			// known mime
			var filePath = null;
			if(patharr[0] === 'blog') {
				
				// pathname = /blog/..  file in blogpath
				patharr.shift();
				filePath = path.join(blogpath, patharr.join('/'));
				
			} else {
				filePath = v2rpath(pathname);
			}
			
			fs.readFile(filePath, function(err,data) {
			
				if (err) {
					res.writeHead(404);
					res.end();
				} else {				
					res.writeHead(200,{
						'Content-Type' : mime[extname],
						'Cache-Control': 'max-age='+2*24*60*60,					
						'Expires'	   : new Date(new Date().getTime()+2*24*60*60*1000).toGMTString()
					});
					res.end(data);
				}
			})
			
		} else {	
		
			
			res.writeHead(200, {'Content-Type':'text/html'});		
			var output = genPageFromBaseSync(patharr);		
			res.end(output);
		
		}
		
	}).listen($.port);
	
}

function genPageFromBaseSync(patharr) {
	var opts = getRenderOpts({patharr:patharr});	
	var basePath = v2rpath(path.join(opts.template, 'base.html'));
	var base = fs.readFileSync(basePath).toString();
	var output = tpl.render(base,opts);
	return output;
};

function include(file,opts){
	var filepath = v2rpath(path.join($.template, file));
	var _temp = fs.readFileSync(filepath).toString();	
	var output = tpl.render(_temp,getRenderOpts(opts));
	return output;
}

function orderByTime(){
	var keys = [];	
	for(var key in $.blog){
		if(!$.blog[key].ignore){
			keys.push(key);
		}		
	}	
	keys.sort(function(b,a){return $.blog[a].time - $.blog[b].time});		
	return keys;
}

function getBlogByPath(patharr){
	if(typeof patharr === 'object'){
		var filepath = patharr.join('/');
		var extname = path.extname(filepath);
		if(extname === '.md'){
			var title = path.basename(filepath,'.md');			
			var blog = getBlogByTitle(title);
			if(blog in $.blog){				
				return $.blog[blog];
			}
		}
	}	
}

function getBlogByTitle(title){
	var json = {};
	for (var key in $.blog) {
		json[$.blog[key]['name']] = key;
	}	
	if (title in json) {
		return json[title];
	}
	return false;
}


function getRenderOpts(opts){
	var orders = orderByTime();
	var result = {	
		discription	:  'test',
		blogs		:	$.blog,
		include		:	include,		
		timeorder	:	orders,
		template	:	$.template,
		getBlogByPath: getBlogByPath,
		/*
		 todo--------------
		 tags: 
		 pathorder:..
		*/
	};
	if(opts && opts.template){
		result.template = opts.template;
	}
	if(typeof opts !== 'object'){
		return result;
	}
	
	if(opts.patharr){
		result.patharr = opts.patharr || [''];
		result.title = opts.patharr[0] || '';
		result.extname = path.extname(opts.patharr.join('/'));
	}
	return result;
}
