let SctRelate = require('../../sfer/scont/sctRelate')

let Scont = require("../../../models/scont/scont");
let Brand = require("../../../models/scont/brand");
let Vendor = require("../../../models/scont/vendor");

let Sfer = require("../../../models/user/sfer");

let Conf = require('../../../../confile/conf.js')

let _ = require('underscore')

exports.multyScont = function(req, res) {
	let filePath = req.body.filePath;
	let excel = require('node-xlsx').parse(filePath)[0];
	let arrs = excel.data;
	saveSconts(2, arrs)
	res.redirect('/mger');
}
saveSconts = function(i, arrs){
	if(i >= arrs.length) {
		console.log('------------------Scont Save Finish: ' + Date.now() + '     ------------------')
		return;
	}
	let arr = arrs[i];
	let scont = new Object();

	if(arr[0] && String((new Date(1900, 0, arr[0])).getTime()).length > 10){
		scont.updateAt = (new Date(1900, 0, arr[0])).getTime() - 1000*60*60*24
	} else {
		scont.updateAt = new Date('1/1/2015')
	}
	let brandCode = String(arr[1]).replace(/(\s*$)/g, "").replace( /^\s*/, '');

	let typeCode
	if(arr[6]){
		typeCode = String(arr[6]).replace(/(\s*$)/g, "").replace( /^\s*/, '')
	} else {
		typeCode = 'OTHER'
	}

	let contacter
	if(arr[8]){
		let contacters = arr[8].split('\t\n')
		contacter = String(contacters[0]).replace(/(\s*$)/g, "").replace( /^\s*/, '');
	}

	let vendorCode
	if(arr[7]){
		vendorCode = String(arr[7]).replace(/(\s*$)/g, "").replace( /^\s*/, '');
	} else {
		if(typeCode == 'PRODUTTORE'){
			vendorCode = '(' + typeCode + ')' + brandCode;
		} else {
			vendorCode = '[' + typeCode + ']' + brandCode + '_' + contacter;
		}
	}

	scont.scont = String(arr[14]).replace(/(\s*$)/g, "").replace( /^\s*/, '');
	

	if(arr[18] && String((new Date(1900, 0, arr[18])).getTime()).length > 10){
		scont.createAt = (new Date(1900, 0, arr[18])).getTime()  - 1000*60*60*24
	} else {
		scont.createAt = new Date('1/1/2015')
	}

	let rif
	if(arr[19]){
		rif = arr[19].split('+')[0].replace(/(\s*$)/g, "").replace( /^\s*/, '')
	} else {
		rif = 'DEPARTURE'
	}

	if(arr[25]){
		let status = String(arr[25]).split('+')[0].replace(/(\s*$)/g, "").replace( /^\s*/, '')
		scont.status = parseInt(status)
	} else {
		scont.status = 1;
	}
	scont.cause = 6;
	

	Brand.findOne({code: brandCode}, function(err, objBrand){
	if(err) console.log(i + ':   ++++SCONT > Brand findOne Error   +++++   ');
	if(!objBrand) {
		console.log(i + "--------" + brandCode + " ------ " + scont.canale + " :Brand is not exist");
		saveSconts(i+1, arrs)
	} else {
		scont.brand = objBrand._id;

		Vendor.findOne({code: vendorCode}, function(err, objVendor){
		if(err) console.log(i + ':   ++++SCONT > Vendor findOne Error   +++++   ');
		if(!objVendor) {
			console.log(i + "--------" + brandCode + " ------ " +vendorCode + " : Vendor is not exist")
			saveSconts(i+1, arrs)
		} else {
			scont.vendor = objVendor._id

			Scont
			.find()
			.where('brand').equals(String(scont.brand))
			.where('vendor').equals(String(scont.vendor))
			.exec(function(err, sconts){
				if(err) console.log(i + ':   ++++SCONT > Scont findOne Error   +++++   ');
				if(sconts.length > 0){
					console.log(i + "--------" + brandCode + " ------ " + vendorCode + " is exist");
					saveSconts(i+1, arrs)
				} else {
					Sfer.findOne({name: rif}, function(err, objSfer){
						if(err) console.log(i + ':   ++++SCONT > Sfer findOne Error   +++++   ');
						if(objSfer) {
							scont.creater = scont.updater = objSfer._id
						}
						// 此模块同样出现在产品添加的存储
						let _scont = new Scont(scont)

						SctRelate.scontRelBrand('Brand', _scont.brand, _scont._id, 1)
						SctRelate.scontRelVendor('Vendor', _scont.vendor, _scont._id, 1)
						_scont.save(function(err, objSave) {
							if(err) console.log(i + "_____Scont Save Error");
							saveSconts(i+1, arrs)
						})
					})
				}
			})
			
		}
		})
	}
	})
}