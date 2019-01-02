let Index = require('../index');
let Brand = require('../../../models/scont/brand');
let Bcateg = require('../../../models/scont/bcateg');
let Nation = require('../../../models/scont/nation');

let Conf = require('../../../../confile/conf.js')
let _ = require('underscore');


exports.brandListFilter = function(req, res, next) {
	// 分页
	let page = parseInt(req.query.page) || 0
	let count = 10
	let index = page * count
	let slipCond = ""; // 分页时用到的其他条件

	// 条件判断   ----------------
	// 查找关键字
	let keytype = "code"
	if(req.query.keytype) { 
		keytype = req.query.keytype;
		slipCond += "&keytype="+keytype;
	}

	let keyword = "";
	if(req.query.keyword) {
		keyword = req.query.keyword.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		slipCond += "&keyword="+keyword;
	}
	
	// 根据状态筛选
	let condStatus;
	// console.log(req.query.status)
	if(!req.query.status) {
		condStatus = Object.keys(Conf.stsBrand);
	} else {
		condStatus = req.query.status;
		if(condStatus instanceof Array){
			for(status in condStatus){
				slipCond += "&status="+status;
			}
		} else {
			slipCond += "&status="+condStatus;
		}
	}
	// console.log(condStatus)
	// 选择创建的开始时间
	let condCrtStart, symCrtStart;
	if(req.query.crtStart && req.query.crtStart.length == 10){
		symCrtStart = "$gt";   // $ ne eq gte gt lte lt
		condCrtStart = new Date(req.query.crtStart).setHours(0,0,0,0);
		slipCond += "&crtStart="+req.query.crtStart;
	} else {
		symCrtStart = "$ne";
		condCrtStart = null;
	}

	// console.log(req.query.crtStart)
	// console.log(symCrtStart)
	// console.log(condCrtStart)
	// 选择创建的结束时间
	let condCrtEnded, symCrtEnded;
	if(req.query.crtEnded && req.query.crtEnded.length == 10){
		symCrtEnded = "$lt";
		condCrtEnded = new Date(req.query.crtEnded).setHours(23,59,59,0)
		slipCond += "&crtEnded="+req.query.crtEnded;
	} else {
		symCrtEnded = "$ne";
		condCrtEnded = null;
	}
	// 选择更新的开始时间
	let condUpdStart, symUpdStart;
	if(req.query.updStart && req.query.updStart.length == 10){
		symUpdStart = "$gt";
		condUpdStart = new Date(req.query.updStart).setHours(0,0,0,0);
		slipCond += "&updStart="+req.query.updStart;
	} else {
		symUpdStart = "$ne";
		condUpdStart = null;
	}
	// 选择更新的结束时间
	let condUpdEnded, symUpdEnded;
	if(req.query.updEnded && req.query.updEnded.length == 10){
		symUpdEnded = "$lt";
		condUpdEnded = new Date(req.query.updEnded).setHours(23,59,59,0)
		slipCond += "&updEnded="+req.query.updEnded;
	} else {
		symUpdEnded = "$ne";
		condUpdEnded = null;
	}
	// console.log(symCrtEnded)
	// console.log(condCrtEnded)

	Brand.count({
		[keytype]: new RegExp(keyword + '.*'),
		'createAt': {[symCrtStart]: condCrtStart, [symCrtEnded]: condCrtEnded},
		'updateAt': {[symUpdStart]: condUpdStart, [symUpdEnded]: condUpdEnded},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, amount) {
		if(err) console.log(err);
		Brand.find({
			[keytype]: new RegExp(keyword + '.*'),
			'createAt': {[symCrtStart]: condCrtStart, [symCrtEnded]: condCrtEnded},
			'updateAt': {[symUpdStart]: condUpdStart, [symUpdEnded]: condUpdEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.skip(index)
		.limit(count)
		.populate('bcateg')
		.populate('nation')
		.sort({'status': 1, 'updateAt': -1})
		.exec(function(err, objects){
			if(err) console.log(err);
			if(objects){
				let object = new Object()
				object.objects = objects;

				object.keytype = req.query.keytype;
				object.keyword = req.query.keyword;

				object.condStatus = condStatus;
				object.condCrtStart = req.query.crtStart;
				object.condCrtEnded = req.query.crtEnded;
				object.condUpdStart = req.query.updStart;
				object.condUpdEnded = req.query.updEnded;

				object.amount = amount;
				object.count = count;
				object.page = page;

				object.slipCond = slipCond;

				req.body.object = object;
				next();
			} else {
				info = "Option error, Please Contact Manger"
				Index.sfOptionWrong(req, res, info)
			}
		})
	})
}
exports.brandList = function(req, res) {
	let object = req.body.object
	res.render('./sfer/scont/brand/list', {
		title: 'Brand List',
		crSfer: req.session.crSfer,
		
		objects: object.objects,
		amount: object.amount,

		condStatus: object.condStatus,
		condCrtStart: object.condCrtStart,
		condCrtEnded: object.condCrtEnded,
		condUpdStart: object.condUpdStart,
		condUpdEnded: object.condUpdEnded,
		keytype: object.keytype,
		keyword: object.keyword,

		currentPage: (object.page + 1),
		totalPage: Math.ceil(object.amount / object.count),
		slipUrl: '/brandList?',
		slipCond: object.slipCond,

		filterAction: '/brandList',
		printAction: '/brandListPrint'
	})
}

// header search
exports.headerBrand = function(req, res) {
	let object = req.body.object
	if(object && object.objects) {
		let objects = object.objects;
		if(objects.length > 0) {
			if(objects.length == 1) {
				res.redirect("/brandDetail/"+objects[0]._id)
			} else {
				res.redirect('/brandList?keyword='+object.keyword)
			}
		} else {
			info = "This Brand Code is not Exist"
			Index.sfOptionWrong(req, res, info)
		}
	} else {
		info = "Option Error~!"
		Index.sfOptionWrong(req, res, info)
	}
}



exports.brandAdd = function(req, res) {
	Nation.find(function(err, nations) {
		if(err) console.log(err);
		res.render('./sfer/scont/brand/add', {
			title: 'BrandAdd',
			crSfer: req.session.crSfer,
			nations: nations
		})
	})
}


exports.addBrand = function(req, res) {
	let objBody = req.body.object

	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	objBody.updateAt = objBody.createAt = Date.now();

	Brand.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "This Brand Code is Exist"
			Index.sfOptionWrong(req, res, info)
		} else {
			let _object = new Brand(objBody)
			_object.creater = req.session.crSfer._id
			_object.save(function(err, objSave) {
				if(err) console.log(err);

				// 分类中的品牌个数要 +1
				categChangeBrandnum(objSave.bcateg, 1)
				nationChangeBrandnum(objSave.nation, 1)

				res.redirect('/brandList')
			})
		}
	})
}



exports.brandDetail = function(req, res){
	let id = req.params.id
	Brand.findOne({_id: id})
	.populate('bcateg')
	.populate('nation')
	.populate({
		path: 'sconts',
		options: {sort: {'status': 1} },
		populate: {path: 'vendor' } 
	})
	.populate('creater')
	.populate('updater')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			// console.log(object)
			res.render('./sfer/scont/brand/detail', {
				title: 'Brand Detail',
				crSfer: req.session.crSfer,
				object: object
			})
		} else {
			info = "This BrandI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.brandUpdate = function(req, res){
	let id = req.params.id
	Brand.findOne({_id: id})
	.populate('bcateg')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			Nation.find(function(err, nations) {
				if(err) console.log(err);
				res.render('./sfer/scont/brand/update', {
					title: 'Brand Update',
					crSfer: req.session.crSfer,
					object: object,
					nations: nations
				})
			})
		} else {
			info = "This BrandI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.updateBrand = function(req, res) {
	let objBody = req.body.object

	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	objBody.updateAt = Date.now();

	Brand.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(object){
			Brand.find({code: objBody.code})
			.where('_id').ne(objBody._id)
			.exec(function(err, objects) {
				if(err) console.log(err);
				if(objects.length > 0){
					info = "This Brand Code is Exist"
					Index.sfOptionWrong(req, res, info)
				} else {
					let _object = _.extend(object, objBody)
					_object.updateUser = req.session.crSfer._id
					_object.save(function(err, objSave) {
						if(err) console.log(err);

						// 判断分类中的品牌个数的增减
						let orgBcateg = req.body.orgBcateg
						if(String(objSave.bcateg) != String(orgBcateg)) {
							// 分类中的品牌个数要 +1
							categChangeBrandnum(objSave.bcateg, 1)
							// 分类中的品牌个数要 -1
							categChangeBrandnum(orgBcateg, -1)
						}
						let orgNation = req.body.orgNation
						if(String(objSave.nation) != String(orgNation)) {
							nationChangeBrandnum(objSave.nation, 1)
							nationChangeBrandnum(orgNation, -1)
						}
						res.redirect('/brandList')
					})
				}
			})
		} else {
			info = "This Brand is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.brandDel = function(req, res) {
	let id = req.query.id
	Brand.findOne({_id: id})
	.exec(function(err, brand){
		if(err) console.log(err);
		if(brand){
			if(brand.sconts && brand.sconts.length > 0){
				res.json({success: 0, failDel: "Attention! You can't delete this brand"})
			}else{

				// 分类中的品牌个数要 -1
				categChangeBrandnum(brand.bcateg, -1)
				nationChangeBrandnum(brand.nation, -1)

				Brand.remove({_id: id}, function(err, brander) {
					if(err) {
						res.json({success: 0, failDel: "删除失败,原因不明,联系管理员"})
					} else {
						res.json({success: 1})
					}
				})
			}
		} else {
			res.json({success: 0, failDel: "已被删除，按F5刷新页面查看"})
		}
	})
}









// Ajax
exports.ajaxCodeBrand = function(req, res) {
	let keytpye = req.query.keytype
	let keyword = req.query.keyword.toUpperCase();
	// console.log(keytpye)
	// console.log(keyword)
	Brand.findOne({[keytpye]: keyword}, function(err, brand) {
		if(err) console.log(err);
		if(brand){
			res.json({success: 1, brand: brand})
		} else {
			Brand.find({[keytpye]: new RegExp(keyword + '.*')}, function(err, brands) {
				if(err) console.log(err);
				if(brands && brands.length > 0) {
					res.json({success: 2, brands: brands});
				} else {
					res.json({success: 0})
				}
			})
		}
	})
}









// 分类中的品牌个数变化
categChangeBrandnum = function(bcategId, vary) {
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
nationChangeBrandnum = function(nationId, vary) {
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


exports.ajaxBrandSts = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	Brand.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(object){
			object.status = parseInt(newStatus)

			object.save(function(err,objSave) {
				if(err) console.log(err);
				res.json({success: 1, info: "标记已经完成"});
			})
		} else {
			res.json({success: 0, info: "已被删除，按F5刷新页面查看"})
		}
	})
}