/**
 * @param file array
 * 
 * return hash
 */

var path = require('path');
var fs = require('fs');
var marked = require('marked');
var hl = require('highlight').Highlight;
 
module.exports = function(files, blogPath) {
	return getBlogInfoSync(files, blogPath);
}

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  highlight: function(code) {    
	var lang = "javascript";
	var codeArr = code.split('\n');	
	if(codeArr[0].indexOf(':::') === 0){
		lang = codeArr[0].substring(3,codeArr[0].length);		
		codeArr.shift();
		code = codeArr.join('\n');
	}
	lang = "javascript";
	return hl(code);	
  }
});

function getBlogInfoSync(blogList, blogPath){
	var blogJson = {};
	blogList.forEach(function(blog){
		var name = path.basename(blog,'.md');
		//var relative = blog.replace(/\\/g,'/');
		var relative = path.relative(blogPath, blog); // get \ at first
		relative = path.join('blog', relative);
		relative = relative.replace(/\\/g, '/');
		var _stat = fs.lstatSync(blog);
		
		var contentJson = getContentSync(blog);	
		var t =  _stat.atime;
		if(contentJson.date){
			t = new Date(contentJson.date);
		}
		var showtime = [t.getFullYear(),t.getMonth()+1,t.getDate()].join('-');
		var detailtime = showtime+' '+t.getHours()+':'+t.getMinutes();
		blogJson[blog] = {
			name: name, // name is filename without extname, total English for compatible
			title: contentJson.title, // title of blog, maybe Chinese
			relative: '/'+relative, // relative path of blog, '/' because it should be absolute path
			ctime: _stat.ctime,
			mtime: _stat.mtime,
			time: t, // time is date in blog or atime, we just use this
			showtime: showtime, // pretty format of time above
			detailtime: detailtime, // showtime add hour and minute
			ignore: contentJson.ignore,
			tag: contentJson.tag,
			html: marked(contentJson.mdstr),
			preview: getPreview(contentJson.mdstr)
		}
	});
	
	return blogJson;	
}

function getPreview(mdstr){
	// return marked(mdstr.substring(0, 200));
	var _arr = mdstr.split('\n');
	var _arr2 = _arr.slice(0, 10);
	return marked(_arr2.join('\n'));
}



function getContentSync(blog){
	var content = fs.readFileSync(blog).toString();
	var title = path.basename(blog);
	var tag = "none";
	
	filestr = content.replace(/\r\n/g,'\n');
	var filearr = filestr.split('\n\n');
	var fileattr = filearr.shift();
	if (fileattr.indexOf('title') === -1 && fileattr.indexOf('tag') === -1) {
		filearr.unshift(fileattr);
	}
	var filecontent = filearr.join('\n\n');
	var attrArr = fileattr.split('\n');
	var attrjson = {};
	attrArr.forEach(function(attr){
		var arr = attr.split(':');		
		var key = arr[0];
		var value = arr[1];
		if(arr.length > 2){
			arr.shift();
			value = arr.join(':');
		}
		attrjson[key] = value;
		
	});
	return {
		ignore:attrjson['ignore'] || false,
		date:attrjson['date'] || false,
		title:attrjson['title']||title,
		tag:attrjson['tag']||tag,
		mdstr:filecontent
	}
}
