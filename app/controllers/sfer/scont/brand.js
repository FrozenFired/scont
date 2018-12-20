let Index = require('../index')
let Brand = require('../../../models/scont/brand')
let Bcateg = require('../../../models/scont/bcateg')
let Nation = require('../../../models/scont/nation')
let _ = require('underscore')


exports.brandList = function(req, res) {
	Brand.find()
	.populate('bcateg')
	// .populate({path: 'brands', options: {sort: {'weight': -1} } } )
	.sort({"code": -1})
	.exec(function(err, objects){
		if(err) console.log(err);
		res.render('./sfer/scont/brand/list', {
			title: 'Brand List',
			crSfer: req.session.crSfer,
			objects: objects
		})
	})
}

exports.brandAdd = function(req, res) {
	Bcateg.find(function(err, bcategs) {
		if(err) console.log(err);
		Nation.find(function(err, nations) {
			if(err) console.log(err);
			res.render('./sfer/scont/brand/add', {
				title: 'BrandAdd',
				crSfer: req.session.crSfer,
				bcategs: bcategs,
				nations: nations
			})
		})
	})
}


exports.addBrand = function(req, res) {
	let objBody = req.body.object

	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')
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
	// .populate({path: 'brands', options: {sort: {'weight': -1} } } )
	.populate('bcateg')
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
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			Bcateg.find(function(err, bcategs) {
				if(err) console.log(err);
				Nation.find(function(err, nations) {
					if(err) console.log(err);
					res.render('./sfer/scont/brand/update', {
						title: 'Brand Update',
						crSfer: req.session.crSfer,
						object: object,
						bcategs: bcategs,
						nations: nations
					})
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
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')

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
	let keyword = req.query.keyword
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