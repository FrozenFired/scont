let Index = require('../index');
let rtPath = require('path').join(__dirname, "../../../../");

let MiddleExcel = {
	loadFile : function(req, res, next) {
		if(req.files) {
			let fileData = req.files.mulFile;
			let filePath = fileData.path;
			if(filePath) {
				let arrs = filePath.split('.');
				let type = arrs[arrs.length -1]
				// console.log(type)
				if(type == 'xlsx') {
					req.body.filePath = filePath;
					next();
				} else {
					info = "The File must excel [***.xlsx]";
					Index.mgOptionWrong(req, res, info);
				}
			}
			else{
				info = "Upload the File Error";
				Index.mgOptionWrong(req, res, info);
			}
		} else {
			info = "Please Upload the File";
			Index.mgOptionWrong(req, res, info);
		}
	},
};

module.exports = MiddleExcel;