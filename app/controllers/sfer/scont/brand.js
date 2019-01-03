let Index = require('../index');
let Brand = require('../../../models/scont/brand');
let Bcateg = require('../../../models/scont/bcateg');
let Nation = require('../../../models/scont/nation');

var Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let _ = require('underscore');

exports.brandListFilter = function(req, res, next) {
	let title = 'brand List';
	let url = "/brandList";

	// 分页
	let slipCond = ""; // 分页时用到的其他条件

	let page = 0, entry = 10;
	[entry, page, slipCond] = Filter.slipPage(req, entry, slipCond)
	let index = page * entry;

	// 条件判断   ----------------
	// 查找关键字
	let keytype = "code", keyword = "";
	[keytype, keyword, slipCond] = Filter.key(req, keytype, keyword, slipCond)
	// 根据状态筛选
	let condStatus = Object.keys(Conf.stsBrand);
	// let condStatus = 0;
	[condStatus, slipCond] = Filter.status(req.query.status, condStatus, slipCond);
	// 根据创建更新时间筛选
	let at = Filter.at(req);
	slipCond+=at.slipCond;

	Brand.count({
		[keytype]: new RegExp(keyword + '.*'),
		'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
		'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Brand.find({
			[keytype]: new RegExp(keyword + '.*'),
			'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
			'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.skip(index)
		.limit(entry)
		.populate('bcateg')
		.populate('nation')
		.sort({'status': 1, 'updateAt': -1})
		.exec(function(err, objects){
			if(err) console.log(err);
			if(objects){
				let list = new Object()
				list.title = title;
				list.url = url;
				list.crSfer = req.session.crSfer;

				list.count = count;
				list.objects = objects;

				list.keytype = req.query.keytype;
				list.keyword = req.query.keyword;

				list.condStatus = condStatus;

				list.condCrtStart = req.query.crtStart;
				list.condCrtEnded = req.query.crtEnded;
				list.condUpdStart = req.query.updStart;
				list.condUpdEnded = req.query.updEnded;

				list.currentPage = (page + 1);
				list.entry = entry;
				list.totalPage = Math.ceil(count / entry);

				list.slipCond = slipCond;

				req.body.list = list;
				next();
			} else {
				info = "Option error, Please Contact Manger"
				Index.sfOptionWrong(req, res, info)
			}
		})
	})
}
exports.brandList = function(req, res) {
	res.render('./sfer/scont/brand/list', req.body.list)
}

// header search
exports.headerBrand = function(req, res) {
	let objects = req.body.list.objects
	if(objects && objects.length > 0) {
		if(objects.length == 1) {
			res.redirect("/brandDetail/"+objects[0]._id)
		} else {
			res.redirect('/brandList?keyword='+object.keyword)
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