let Index = require('./index')
let Car = require('../../../models/task/car')
let Cared = require('../../../models/task/cared')
let _ = require('underscore')

exports.sfCars = function(req, res) {
	Car.find()
	.populate('apler', 'code')
	.exec(function(err, objects) {
		if(err) console.log(err);
		// console.log(objects)
		res.render('./sfer/sfer/car/list', {
			title: 'Cars',
			crSfer: req.session.crSfer,
			objects: objects
		})
	})
}

exports.sfCarAppl = function(req, res) {
	let crSfer = req.session.crSfer;
	let id = req.query.id;
	let newStatus = parseInt(req.query.newStatus);
	Car.findOne({_id: id}, function(err, object) {
		if(err) {
			info = '汽车查找错误，请联系管理员， Contact Kelin heihei!'
			res.json({success: 0, info: info});
		} else if(!object) {
			info = '没有找到此量车，刷新尝试';
			res.json({success: 0, info: info});
		} else {
			let caredObj = new Object;
			caredObj.car = object._id;
			caredObj.apler = crSfer._id;
			caredObj.ctAt = Date.now();
			let _cared = new Cared(caredObj);
			// console.log(_cared)
			_cared.save(function(err, caredSave) {
				if(err) {
					info = 'sfCarAppl database error caredSave, Contact Manager';
					res.json({success: 0, info: info});
				} else {

					object.status = 2;
					object.apler = crSfer._id;
					object.cared = caredSave._id;

					object.save(function(err, objSave) {
						if(err) {
							info = 'sfCarAppl database error CarSave, Contact Manager';
							res.json({success: 0, info: info});
						} else {
							res.json({success: 1});
						}
					})
				}
			})
		}
	})
}