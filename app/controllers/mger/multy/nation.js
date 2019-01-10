let rtPath = require('path').join(__dirname, "../../../../");
let Nation = require("../../../models/scont/nation");

var _ = require('underscore')

exports.multyNation = function(req, res) {
	let filePath = req.body.filePath;
	let excel = require('node-xlsx').parse(filePath)[0];
	let arrs = excel.data;
	saveNations(2, arrs.length, arrs)
	res.redirect('/mger');
}
saveNations = function(i, n, arrs){
	if(i >= n) return;
	let arr = arrs[i];
	arr[0] = arr[0].replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(arr[0] && arr[0].length > 0) {
		let nation = new Object();
		nation.code = arr[0]
		nation.name = arr[1]
		nation.nameEN = arr[2]
		nation.nameCN = arr[3]
		nation.tel = arr[4]
		nation.weight = arr[5]
		// console.log(nation)
		Nation.findOne({code: nation.code}, function(err, nationObj) {
			if(err) console.log(err);
			if(nationObj) {
				console.log(nation.code + " is already existed");
				saveNations(i+1, n, arrs)
			} else {
				var _nation = new Nation(nation)
				_nation.save(function(err, nationObj) {
					if(err) console.log(err);
					saveNations(i+1, n, arrs)
				})
			}
		})
	} else {
		console.log("In " + (i+1) + "th row The code is not complete");
		saveNations(i+1, n, arrs)
	}
}