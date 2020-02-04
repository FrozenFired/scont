let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Float = require('mongoose-float').loadType(mongoose, 2)
let ObjectId = Schema.Types.ObjectId
const colection = 'Ord';
let dbSchema = new Schema({
	updater: {type: ObjectId, ref: 'Sfer'},
	updateAt: Date,
	creater: {type: ObjectId, ref: 'Sfer'},
	createAt: Date,
	vder: {type: ObjectId, ref: 'Vendor'},
	ordCode: String,
	brand: String,
	piCode: String, // proforma invoice
	piPhoto: String,

	price: Float,
	taxType: Number,

	qtNote: String,
	odNote: String,
	fnNote: String,
	lgNote: String,

	fattAt: Date,	// 发票上传日期
	vdNote: String,

	status: String,

	volumeLg: Float,	// 体积（物流用）
	gwlg: Number, // gross weight 毛重
	nwlg: Number, // net weight 净重
	packlg: Number, // 箱子个数

});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.createAt = this.updateAt = Date.now()
		this.status = 10;
	} else {
		this.updateAt = Date.now()
	}
	next()
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;