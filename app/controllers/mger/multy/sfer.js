let rtPath = require('path').join(__dirname, "../../../../");
let Sfer = require("../../../models/user/sfer");
let Conf = require('../../../../confile/conf.js')

let _ = require('underscore')

let bcrypt = require('bcryptjs')
let SALT_WORK_FACTOR = 10

exports.multySfer = function(req, res) {
	let filePath = req.body.filePath;
	let excel = require('node-xlsx').parse(filePath)[0];
	let arrs = excel.data;
	// console.log(arrs)
	saveSfers(2, arrs.length, arrs)
	res.redirect('/mger');
}
saveSfers = function(i, n, arrs){
	if(i >= n) return;
	let arr = arrs[i];
	if(arr[0] && (arr[2] == 0 || arr[2])) {
		arr[0] = arr[0].replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		arr[2] = String(arr[2]).replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		let sfRole = Object.keys(Conf.sfRole);
		if(arr[0].length > 0 && arr[2].length > 0 && sfRole.indexOf(String(arr[2])) > -1){
			let sfer = new Object();
			sfer.code = arr[0]

			sfer.password = arr[1];
			if(!sfer.password) sfer.password = 1;
			sfer.role = parseInt(arr[2])
			// console.log(sfer.role)
			sfer.name = arr[3]

			sfer.telephone = arr[4]
			// console.log(sfer)
			Sfer.findOne({code: sfer.code}, function(err, sferObj) {
				if(err) console.log(err);
				if(sferObj) {
					console.log(sfer.code + " is already existed");
					saveSfers(i+1, n, arrs)
				} else {
					bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
						if(err) console.log(err)
						bcrypt.hash(sfer.password, salt, function(err, hash) {
							if(err) console.log(err)
							sfer.password = hash
							let _sfer = new Sfer(sfer)
							_sfer.save(function(err, SferObj){
								if(err) console.log(err);
								saveSfers(i+1, n, arrs);
							})
						})
					})
				}
			})
		} else {
			console.log("In " + (i+1) + "th row The code or Role Number is wrong");
			saveSfers(i+1, n, arrs)
		}
	} else {
		console.log("In " + (i+1) + "th row The code or Role is not complete");
		saveSfers(i+1, n, arrs)
	}
}