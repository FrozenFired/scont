let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Float = require('mongoose-float').loadType(mongoose, 2)
let ObjectId = Schema.Types.ObjectId
const colection = 'Pay';
let dbSchema = new Schema({
	vder: {type: ObjectId, ref: 'Vendor'},
	order: {type: ObjectId, ref: 'Order'},

	code: String, // auto: ac sa sa2
	price: Float,	// 金额
	photo: String,	// 付款截图

	method: Number,	// BONIFICO CREDIT	SYSTEM 付款方式
	agCode: String, // 支票号码
	createAt: Date,	// 创建时间
	paidAt: Date,	// 支付时间

	status: String,	// paid unpaid 状态
	mailed: String, // Not Mailed 是否已经发邮件标记
	note: String,	// 备注

	picUrl: String, // 保存照片的路径

	paider: {type: ObjectId, ref: 'Sfer'},	// 付款人
});

dbSchema.pre('save', function(next) {
	next()
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;