let Index = require('../index')
let Bcateg = require('../../../models/scont/bcateg')
let Brand = require('../../../models/scont/brand')

let moment = require('moment')
let Conf = require('../../../../confile/conf.js')
let _ = require('underscore')

exports.bcategsFilter = function(req, res, next) {
	Bcateg.find()
	.sort({"bcate": 1, "numbrand": -1})
	.exec(function(err, objects){
		if(err) console.log(err);
		if(objects) {
			req.body.objects = objects;
			next();
		} else {
			info = "Can not Find Category"
			Index.sfOptionWrong(req, res, info)
		}
	})
}
exports.bcategList = function(req, res) {
	let objects = req.body.objects;
	res.render('./sfer/scont/bcateg/list', {
		title: 'Bcateg List',
		crSfer: req.session.crSfer,
		objects: objects
	})
}
exports.bcategListPrint = function(req, res) {
	let objects = req.body.objects;
	let xl = require('excel4node');
	let wb = new xl.Workbook({
		defaultFont: {
			size: 12,
			color: '333333'
		},
		dateFormat: 'yyyy-mm-dd hh:mm:ss'
	});
	
	let ws = wb.addWorksheet('Sheet 1');
	ws.column(1).setWidth(20);
	ws.column(2).setWidth(20);
	ws.column(3).setWidth(20);
	ws.column(4).setWidth(20);
	ws.column(5).setWidth(15);
	
	// header
	ws.cell(1,1).string('Category1');
	ws.cell(1,2).string('Category2');
	ws.cell(1,3).string('English');
	ws.cell(1,4).string('中文名');
	ws.cell(1,6).string('Brand Number');

	for(let i=0; i<objects.length; i++){
		let item = objects[i];
		if(item.bcate || item.bcate==0) ws.cell((i+2), 1).string(Conf.bcate[item.bcate]);
		if(item.code) ws.cell((i+2), 2).string(String(item.code));
		if(item.nameEN) ws.cell((i+2), 3).string(String(item.nameEN));
		if(item.nameCN) ws.cell((i+2), 4).string(String(item.nameCN));
		if(item.numbrand) ws.cell((i+2), 6).string(String(item.numbrand));
	}

	wb.write('Category_'+req.session.crSfer.code+'_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}


exports.bcategAdd = function(req, res) {
	res.render('./sfer/scont/bcateg/add', {
		title: 'BcategAdd',
		crSfer: req.session.crSfer,
	})
}


exports.addBcateg = function(req, res) {
	let objBody = req.body.object

	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')
	Bcateg.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "This Bcateg Code is Exist"
			Index.sfOptionWrong(req, res, info)
		} else {
			let _object = new Bcateg(objBody)
			_object.creater = req.session.crSfer._id
			_object.save(function(err, objSave) {
				if(err) console.log(err);

				res.redirect('/bcategList')
			})
		}
	})
}




exports.bcategDetail = function(req, res){
	let id = req.params.id
	Bcateg.findOne({_id: id})
	// .populate({path: 'brands', options: {sort: {'weight': -1} } } )
	.populate('creater')
	.populate('updater')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			Brand.find({bcateg: object._id})
			.populate('nation')
			.exec(function(err, brands) {
				if(err) console.log(err);
				if(object.numbrand != brands.length) {
					object.numbrand = brands.length;
					object.save(function(err, objSave) {
						if(err) console.log(err);
					})
				}
				res.render('./sfer/scont/bcateg/detail', {
					title: 'Bcategory Detail',
					crSfer: req.session.crSfer,
					object: object,
					brands: brands
				})
			})
		} else {
			info = "This BcategI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.bcategUpdate = function(req, res){
	let id = req.params.id
	Bcateg.findOne({_id: id})
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			res.render('./sfer/scont/bcateg/update', {
				title: 'Bcategory Update',
				crSfer: req.session.crSfer,
				object: object,
			})
		} else {
			info = "This BcategI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.updateBcateg = function(req, res) {
	let objBody = req.body.object
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')

	Bcateg.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(object){
			Bcateg.find({code: objBody.code})
			.where('_id').ne(objBody._id)
			.exec(function(err, objects) {
				if(err) console.log(err);
				if(objects.length > 0){
					info = "This Bcateg Code is Exist"
					Index.sfOptionWrong(req, res, info)
				} else {
					let _object = _.extend(object, objBody)
					_object.updateUser = req.session.crSfer._id
					_object.save(function(err, objSave) {
						if(err) console.log(err);

						res.redirect('/bcategList')
					})
				}
			})
		} else {
			info = "This Bcateg is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.bcategDel = function(req, res) {
	let id = req.query.id
	Bcateg.findOne({_id: id})
	.exec(function(err, bcateg){
		if(err) console.log(err);
		if(bcateg){
			if(bcateg.numbrand > 0){
				res.json({success: 0, failDel: "Attention! You can't delete this bcateg"})
			}else{
				Bcateg.remove({_id: id}, function(err, brander) {
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
exports.ajaxBcateg = function(req, res) {
	let keytpye = req.query.keytype
	let keyword = req.query.keyword.toUpperCase();
	// console.log(keytpye)
	// console.log(keyword)
	Bcateg.find({[keytpye]: keyword})
	.sort({"bcate": 1, "numbrand": -1})
	.exec(function(err, bcategs) {
		if(err) console.log(err);
		if(bcategs && bcategs.length > 0){
			res.json({success: 1, bcategs: bcategs})
		} else {
			res.json({success: 0, info: "此分类下，无子分类"});
		}
	})
}
