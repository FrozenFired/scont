let Scont = require('../../../models/scont/scont')
let Vendor = require('../../../models/scont/vendor')
let Brand = require('../../../models/scont/brand')

let SctRelate = {
	// brandDel
	brandUnrelScontVendor : function(i, n, sconts){
		if(i == n) return;
		Scont.findById(sconts[i], function(err, scont){
			if(err) console.log(err);
			Vendor.findById(scont.vendor, function(err, vendor){
				if(err) console.log(err);
				vendor.sconts.remove(sconts[i])
				vendor.save(function(err, vendorSave){
					if(err) console.log(err);
					i = i+1
					SctRelate.brandUnrelScontVendor(i, n, sconts)
				})
			})
			Scont.remove({_id: sconts[i]}, function(err, scont){
				if(err) console.log(err);
			})
		})
	},
	// vendorDel
	vendorUnrelScontBrand : function(i, n, sconts){
		if(i == n) return;
		Scont.findById(sconts[i], function(err, scont){
			if(err) console.log(err);
			Brand.findById(scont.brand, function(err, brand){
				if(err) console.log(err);
				brand.sconts.remove(sconts[i])
				brand.save(function(err, brandSave){
					if(err) console.log(err);
					i = i+1
					SctRelate.vendorUnrelScontBrand(i, n, sconts)
				})
			})
			Scont.remove({_id: sconts[i]}, function(err, scont){
				if(err) console.log(err);
			})
		})
	},
	// 添加scont的时候，与其他数据库关联
	scontRelBrand : function(DB, dbId, scontID, rel){
		DB = eval(DB)	// 把字符串变为变量
		DB.findById(dbId, function(err, object){
			if(err) console.log(err);
			if(rel == 1) {
				object.sconts.push(scontID)
			} else {
				object.sconts.remove(scontID)
			}
			object.save(function(err, objSave){
				if(err) console.log(err);
			})
		})
	},
	// 添加scont的时候，与其他数据库关联
	scontRelVendor : function(DB, dbId, scontID, rel){
		// eval(DB)	// 把字符串变为变量
		Vendor.findById(dbId, function(err, object){
			if(err) console.log(err);
			if(rel == 1) {
				object.sconts.push(scontID)
			} else {
				object.sconts.remove(scontID)
			}
			object.save(function(err, objSave){
				if(err) console.log(err);
			})
		})
	},
}


module.exports = SctRelate