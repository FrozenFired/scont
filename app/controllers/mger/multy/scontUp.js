let Scont = require("../../../models/scont/scont");
let Brand = require("../../../models/scont/brand");
let Vendor = require("../../../models/scont/vendor");

let Conf = require('../../../../confile/conf.js')

let _ = require('underscore')

exports.mgScontUp = function(req, res, next) {
	Scont.find()
	.populate('brand')
	.exec(function(err, sconts){
		if(err) console.log(err);
		mgScontUpd(sconts, 0)
		res.redirect('/mger')
	})
}

mgScontUpd = function(sconts, i) {
	if(i== sconts.length) return;
	let scont = sconts[i];
	scont.iva = scont.brand.iva
	scont.save(function(err, objSave) {
		if(err) {
			console.log(err);
			console.log(i);
		}
		mgScontUpd(sconts, i+1)
	})
}