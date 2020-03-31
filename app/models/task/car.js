let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Car';
let dbSchema = new Schema({
	code: {	// 汽车编号
		unique: true,
		type: String
	},
	nome: String,// 汽车名字
	desp: String, // 描述

	status: Number, // 汽车状态 
	apler: {type: ObjectId, ref: 'Sfer'}, // 申请人
	cared: {type: ObjectId, ref: 'Cared'},

	photo: {	// 汽车照片
		type: String,
		default: '/upload/car/1.jpg'
	},

	createAt: Date,
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.createAt = Date.now();
	}
	next()
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;