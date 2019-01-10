let rtPath = require('path').join(__dirname, "../../../../");
let Bcateg = require("../../../models/scont/bcateg");
let Conf = require('../../../../confile/conf.js')

var _ = require('underscore')

exports.multyBcateg = function(req, res) {
	let filePath = req.body.filePath;
	let excel = require('node-xlsx').parse(filePath)[0];
	let arrs = excel.data;
	saveBcategs(2, arrs.length, arrs)
	res.redirect('/mger');
}
saveBcategs = function(i, n, arrs){
	if(i >= n) return;
	let arr = arrs[i];
	if(arr[0] && (arr[1] == 0 || arr[1])) {
		arr[0] = arr[0].replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		arr[1] = String(arr[1]).replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		let bcate = Object.keys(Conf.bcate);
		if(arr[0].length > 0 && arr[1].length > 0 && bcate.indexOf(String(arr[1])) > -1){
			let bcateg = new Object();
			bcateg.code = arr[0]
			bcateg.bcate = parseInt(arr[1])
			bcateg.nameEN = arr[2]
			bcateg.nameCN = arr[3]
			bcateg.weight = arr[4]
			// console.log(bcateg)
			Bcateg.findOne({code: bcateg.code}, function(err, bcategObj) {
				if(err) console.log(err);
				if(bcategObj) {
					console.log(bcateg.code + " is already existed");
					saveBcategs(i+1, n, arrs)
				} else {
					var _bcateg = new Bcateg(bcateg)
					_bcateg.save(function(err, bcategObj) {
						if(err) console.log(err);
						saveBcategs(i+1, n, arrs)
					})
				}
			})
		} else {
			console.log("In " + (i+1) + "th row The code or Category First Number is wrong");
			saveBcategs(i+1, n, arrs)
		}
	} else {
		console.log("In " + (i+1) + "th row The code or category First is not complete");
		saveBcategs(i+1, n, arrs)
	}
}