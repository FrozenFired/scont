let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Float = require('mongoose-float').loadType(mongoose, 2)
let ObjectId = Schema.Types.ObjectId
const colection = 'Pay';
let dbSchema = new Schema({
	order: {type: ObjectId, ref: 'Order'},

	code: String, // auto: ac sa sa2
	price: Float,

	method: Number,	// BONIFICO CREDIT	SYSTEM 
	agCode: String, // 支票号码
	createAt: Date,
	paidAt: Date,

	status: String,	// paid unpaid
	mailed: String, // Not Mailed
	note: String,

	picUrl: String,

	paider: {type: ObjectId, ref: 'Sfer'},
});

dbSchema.pre('save', function(next) {
	next()
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;