let fs = require('fs');
// let path = require('path');
let projectPath = require('path').join(__dirname, '../../');

let MiddlePicture = {
	deleteOldPhoto : function(orgPhoto, photoDir){
		if(orgPhoto != '/upload' + photoDir + '1.jpg') {
			// fs.unlink(path.join(__dirname, '../../public' + orgPhoto), function(err) { });
			fs.unlink(projectPath + 'public' + orgPhoto, function(err) { });
		}
	},

	addNewPhoto : function(req, res, next) {
		let parameterObj = req.body.object;
		let picName = parameterObj.code;
		let photoDir = parameterObj.photoDir;
		if(photoDir) {
			let photoData = req.files.uploadPhoto;
			let filePath = photoData.path;
			let originalFilename = photoData.originalFilename;
			if(originalFilename) {
				if(parameterObj.orgPhoto){
					MiddlePicture.deleteOldPhoto(parameterObj.orgPhoto, photoDir);
				}
				fs.readFile(filePath, function(err, data) {
					let type = photoData.type.split('/')[1];
					let timestamp = Date.now();
					let photo = '/upload' + photoDir + picName + '_' + timestamp + '.' + type;
					// console.log(path.join(__dirname, '../../public' + photo))
					// console.log(projectPath + 'public' + photo)
					// let newPath = path.join(__dirname, '../../public' + photo);
					let newPath = projectPath + 'public' + photo;
					fs.writeFile(newPath, data, function(err){
						parameterObj.photo = photo;
						next();
					});
				});
			}
			else{
				next();
			}
		} else {
			next();
		}
	},
};

module.exports = MiddlePicture;