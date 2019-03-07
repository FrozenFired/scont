let Vendor = require("../../../models/scont/vendor");

let Sfer = require("../../../models/user/sfer");

let Conf = require('../../../../confile/conf.js')

let _ = require('underscore')

exports.multyVendor = function(req, res) {
	let filePath = req.body.filePath;
	let excel = require('node-xlsx').parse(filePath)[0];
	let arrs = excel.data;
	saveVendors(2, arrs)
	res.redirect('/mger');
}
saveVendors = function(i, arrs) {

	if(i >= arrs.length) {
		console.log('------------------Vendor Save Finish: ' + Date.now() + '    ------------------')
		return;
	}
	let arr = arrs[i];

	let vendor = new Object()

	let brandCode = String(arr[1]).replace(/(\s*$)/g, "").replace( /^\s*/, '');

	let typeCode
	if(arr[6]){
		typeCode = String(arr[6]).replace(/(\s*$)/g, "").replace( /^\s*/, '')
	} else {
		typeCode = 'OTHER'
	}
	let vkey =Object.keys(Conf.vtype);
		
	if(typeCode == "AGENTE + PRO") {
		vendor.vtype = 2
	} else{
		for(vi in vkey) {
			if(Conf.vtype[vi] == typeCode) {
				vendor.vtype = vi
				break;
			}
		}
	}
	
	vendor.contacts = new Array();
	vendor.contacts[0] = new Object();
	// vendor.contacts[1] = new Object();
	let contacter
	if(arr[8]){
		let contacters = arr[8].split('\t\n')
		contacter = vendor.contacts[0].contacter = String(contacters[0]).replace(/(\s*$)/g, "").replace( /^\s*/, '')
		// vendor.contacts[1].contacter = String(contacters[1]).replace(/(\s*$)/g, "").replace( /^\s*/, '')
	}
	if(arr[9]){
		let tels = String(arr[9]).split('\t\n')
		vendor.contacts[0].tel = tels[0]
		// vendor.contacts[1].tel = tels[1]
	}
	if(arr[10]){
		let emails = arr[10].split('\t\n')
		vendor.contacts[0].email = emails[0]
		// vendor.contacts[1].email = emails[1]
	}

	if(arr[7]){
		vendor.code = String(arr[7]).replace(/(\s*$)/g, "").replace( /^\s*/, '')
	} else {
		if(typeCode == 'PRODUTTORE'){
			vendor.code = '(' + typeCode + ')' + brandCode;
		} else {
			vendor.code = '[' + typeCode + ']' + brandCode + '_' + contacter;
		}
	}

	if(arr[15]){
		acsas = String(arr[15]).split('/');
		vendor.ac = parseInt(acsas[0]);
		vendor.sa = 100 - vendor.ac;
	}
	vendor.freight = arr[17]

	if(arr[18] && String((new Date(1900, 0, arr[18])).getTime()).length > 10){
		vendor.createAt = vendor.updateAt = (new Date(1900, 0, arr[18])).getTime()  - 1000*60*60*24
	} else {
		vendor.createAt = vendor.updateAt = new Date('1/1/2015')
	}
	
	let rif;
	if(arr[19]){
		rif = arr[19].split('+')[0].replace(/(\s*$)/g, "").replace( /^\s*/, '')
	} else {
		rif = 'DEPARTURE';
	}
	// console.log("---------------" + i + " -------------")
	Vendor.findOne({code: vendor.code}, function(err, objVendor){
		if(err) console.log(i + '   ++++Vendor findOne Error   +++++   ' + vendor.code);
		if(objVendor){
			saveVendors(i+1, arrs)
		} else {

			Sfer.findOne({name: rif}, function(err, objSfer) {
				if(err) contacters(i+2 + ' +++++Sfer findOne Error  ++++++ ' + arr[19]);
				if(objSfer) vendor.creater = vendor.updater = objSfer._id
				vendor.status = 1
				vendor.weight = 0
				let _vendor = new Vendor(vendor)
				_vendor.save(function(err, objSave) {
					if(err) console.log(i + "_____Vendor Save Error" + vendor.code);
					saveVendors(i+1, arrs)
				})
			})

		}
	})
}