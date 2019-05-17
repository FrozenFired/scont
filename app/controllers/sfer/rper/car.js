let Index = require('./index')
let Car = require('../../../models/task/car')
let Cared = require('../../../models/task/cared')
let _ = require('underscore')

exports.rpCars = function(req, res) {
	Car.find()
	.populate('apler', 'code')
	.exec(function(err, objects) {
		if(err) console.log(err);
		// console.log(objects)
		res.render('./sfer/rper/car/list', {
			title: 'Cars',
			crSfer: req.session.crSfer,
			objects: objects
		})
	})
}

exports.rpCarFilter = function(req, res, next) {
	let id = req.params.id;
	Car.findOne({_id: id})
	.populate('apler', 'code')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			req.body.object = object;
			next();
		} else {
			info = "This Car is deleted, Please reflesh"
			Index.rpOptionWrong(req, res, info)
		}
	})
}

exports.rpCar = function(req, res) {
	let object = req.body.object;
	res.render('./sfer/rper/car/detail', {
		title: 'Car Info',
		crSfer: req.session.crSfer,
		object: object
	})
}

exports.rpCarDel = function(req, res) {
	let object = req.body.object;
	if(object.photo) MiddlePicture.deleteOldPhoto(object.photo, Conf.photoPath.carPhoto)
	Car.remove({_id: object._id}, function(err, objDel) {
		if(err) console.log(err);
		res.redirect('/rpCars')
	})
}

exports.rpCarUp = function(req, res) {
	let object = req.body.object;
	res.render('./sfer/rper/car/update', {
		title: 'New Car',
		crSfer: req.session.crSfer,
		object: object
	})
}

exports.rpCarUpd = function(req, res) {
	let objBody = req.body.object
	Car.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "This car is deleted"
			Index.rpOptionWrong(req, res, info)
		} else {
			let _object = _.extend(object, objBody)

			_object.save(function(err, objSave) {
				if(err) console.log(err)
				res.redirect("/rpCars")
			})
		}
	})
}

exports.rpCarAdd = function(req, res) {
	res.render('./sfer/rper/car/add', {
		title: 'New Car',
		crSfer: req.session.crSfer,
	})
}

exports.rpCarNew = function(req, res) {
	let object = req.body.object;
	Car.findOne({code: object.code}, function(err, carSame) {
		if(err) console.log(err);
		if(carSame) {
			info = "已经有了这个编号"
			Index.rpOptionWrong(req, res, info)
		} else {
			let _object = new Car(object)
			_object.save(function(err, objSave){
				if(err) console.log(err);
				res.redirect('/rpCars')
			})
		}
	})
}


exports.rpCarCnfm = function(req, res) {
	let crSfer = req.session.crSfer;
	let id = req.query.id;
	// let newStatus = parseInt(req.query.newStatus);
	Car.findOne({_id: id}, function(err, object) {
		if(err) {
			info = '汽车查找错误，请联系管理员， Contact Kelin heihei!'
			res.json({success: 0, info: info});
		} else if(!object) {
			info = '没有找到此量车，刷新尝试';
			res.json({success: 0, info: info});
		} else {
			Cared.findOne({_id: object.cared}, function(err, cared) {
				if(err) {
					info = 'rpCarCnfm database error cared findOne, Contact Manager';
					res.json({success: 0, info: info});
				} else if(!cared) {
					info = '没有找到车辆记录，请刷新重试';
					res.json({success: 0, info: info});
				} else {
					cared.cfmer = crSfer._id;
					cared.sAt = Date.now();
					cared.save(function(err, caredSave) {
						if(err) {
							info = 'rpCarCnfm database error caredSave, Contact Manager';
							res.json({success: 0, info: info});
						} else {
							object.status = 3;
							object.save(function(err, objSave) {
								if(err) {
									info = 'rpCarCnfm database error carSave, Contact Manager';
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
	})
}

exports.rpCarEnd = function(req, res) {
	let crSfer = req.session.crSfer;
	let id = req.query.id;
	// let newStatus = parseInt(req.query.newStatus);
	Car.findOne({_id: id}, function(err, object) {
		if(err) {
			info = '汽车查找错误，请联系管理员， Contact Kelin heihei!'
			res.json({success: 0, info: info});
		} else if(!object) {
			info = '没有找到此量车，刷新尝试';
			res.json({success: 0, info: info});
		} else {
			Cared.findOne({_id: object.cared}, function(err, cared) {
				if(err) {
					info = 'rpCarCnfm database error cared findOne, Contact Manager';
					res.json({success: 0, info: info});
				} else if(!cared) {
					info = '没有找到车辆记录，请刷新重试';
					res.json({success: 0, info: info});
				} else {
					cared.ender = crSfer._id;
					cared.eAt = Date.now();
					cared.save(function(err, caredSave) {
						if(err) {
							info = 'rpCarCnfm database error caredSave, Contact Manager';
							res.json({success: 0, info: info});
						} else {
							object.status = 1;
							object.apler = null;
							object.cared = null;
							object.save(function(err, objSave) {
								if(err) {
									info = 'rpCarStatus database error, Contact Manager';
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
	})
}