/**
 * @param string path
 *
 * return array files
 * read file
 */
 
var fs = require('fs');
var path = require('path'); 
 
module.exports = function(path) {
	if (typeof path !== 'string') {
		return false;
	} else {
		return listFileSync(path);
	}
}

function listFileSync(rootpath){
	var fpath = rootpath || __dirname;
	var result = [];
	
	var objArr = fs.readdirSync(fpath);
	for(var i = 0; i < objArr.length; i++){	
		var _file = path.join(fpath,objArr[i]);
		var _stat = fs.statSync(_file);
		if(_stat.isFile()){		
			if(path.extname(_file) === '.md'){
				result.push(_file);
			}
		}
		else{			
			var  _fileArr = listFileSync(_file);			
			for(var j = 0; j < _fileArr.length; j++){				
				result.push(_fileArr[j]);
			}
		}
	}
	return result;
}