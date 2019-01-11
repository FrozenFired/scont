let Brand = require("../../../models/scont/brand");
let Bcateg = require("../../../models/scont/bcateg");
let Nation = require("../../../models/scont/nation");

let Sfer = require("../../../models/user/sfer");

let Conf = require('../../../../confile/conf.js')

let _ = require('underscore')

exports.multyBrand = function(req, res) {
	let filePath = req.body.filePath;
	let excel = require('node-xlsx').parse(filePath)[0];
	let arrs = excel.data;
	saveBrands(2, arrs)
	res.redirect('/mger');
}
saveBrands = function(i, arrs) {
	if(i >= arrs.length) {
		console.log('--------Brand Save Finish: ' + Date.now() + '------------')
		console.log()
		return;
	}
	
	let arr = arrs[i];
	let brand = new Object()
	brand.code = String(arr[1]).replace(/(\s*$)/g, "").replace( /^\s*/, '')

	brand.category = arr[3].replace(/(\s*$)/g, "").replace( /^\s*/, '')

	brand.matDesp = arr[4]

	brand.country = arr[5].replace(/(\s*$)/g, "").replace( /^\s*/, '')

	brand.iva = arr[11];

	if(arr[12] && arr[12].length > 0){
		brand.plist = true;
	} else { 
		brand.plist = false;
	}

	if(arr[13] && arr[13].length > 0) {
		brand.atlas = true;
	} else {
		brand.atlas = false;
	}

	brand.pTime = arr[16]

	brand.website = arr[20]

	brand.webNote = arr[21]

	if(arr[22] && arr[22].length > 0){
		brand.cartace = 1
	} else {
		brand.cartace = 0
	}
	if(arr[23] && arr[23].length > 0){
		brand.video = parseInt(arr[23].replace(/(\s*$)/g, "").replace( /^\s*/, ''))
	} else {
		brand.video = 0
	}

	if(arr[24] && String((new Date(1900, 0, arr[24])).getTime()).length > 10){
		brand.createAt = brand.updateAt = (new Date(1900, 0, arr[24])).getTime()  - 1000*60*60*24
	} else {
		brand.createAt = brand.updateAt = new Date('1/1/2015')
	}

	let rif;
	if(arr[19]){
		rif = arr[19].split('+')[0].replace(/(\s*$)/g, "").replace( /^\s*/, '')
	} else {
		rif = 'DEPARTURE';
	}

	// console.log(brand)
	Brand.findOne({code: brand.code}, function(err, objBrand){
	if(err) console.log(i + '   ++++Brand findOne Error   +++++   ' + brand.code);
	if(objBrand){
		// console.log(brand.code + " is exist");
		saveBrands(i+1, arrs)
	} else {
		Bcateg.findOne({code: brand.category}, function(err, objBateg){
		if(err) console.log(i + '     ++++Mongodb Categ findOne Error   ++++');
		if(!objBateg) {
			console.log(i + "--------" + brand.code + "     :Categ is error-----Can not find: " + brand.category);
			saveBrands(i+1, arrs)
		} else {
			brand.bcateg = objBateg._id;

			Nation.findOne({code: brand.country}, function(err, objNation){
				if(err) console.log(i + '     ++++Mongodb Nation findOne Error    ++++');
				if(!objNation) {
					console.log(i + "--------" + brand.code + "      : Nation is errorerror-----Can not find: " + brand.country)
					saveBrands(i+1, arrs)
				} else {
					brand.nation = objNation._id
					Sfer.findOne({name: rif}, function(err, objSfer) {
						if(err) contacters(i + ' +++++User findOne Error  ++++++ ' + arr[19]);
						if(objSfer) {
							brand.creater = brand.updater = objSfer._id
						}

						brand.status = 1
						brand.weight = 0
						let _brand = new Brand(brand)
						
						_brand.save(function(err, objSave) {
							if(err) {
								console.log(i + "_____Brand Save Error" + brand.code);
							}
							else {
								mulCategChange(objSave.bcateg, 1)
								mulNationChange(objSave.nation, 1)
							}
							saveBrands(i+1, arrs)
						})
					})

				}
			})
		}
		})
	} })
}




// 分类中的品牌个数变化
mulCategChange = function(bcategId, vary) {
	Bcateg.findOne({_id: bcategId}, function(err, bcateg) {
		if(err) console.log(err);
		if(bcateg) {
			bcateg.numbrand += parseInt(vary);
			bcateg.save(function(err, bcategSave) {
				if(err) console.log(err);
			})
		}
	})
}

// nation中的品牌个数变化
mulNationChange = function(nationId, vary) {
	Nation.findOne({_id: nationId}, function(err, nation) {
		if(err) console.log(err);
		if(nation) {
			nation.numbrand += parseInt(vary);
			nation.save(function(err, nationSave) {
				if(err) console.log(err);
			})
		}
	})
}