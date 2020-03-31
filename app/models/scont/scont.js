let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Scont';
let dbSchema = new Schema({
	cause: Number,
	
	brand: {type: ObjectId, ref: 'Brand'},	// 所属品牌
	vendor: {type: ObjectId, ref: 'Vendor'},// 所属供应商
	iva: String,							// iva

	scont: String,							// 折扣
	note: String,							// 备注

	logs: [{								// 更改的历史信息
		scont: String,
		note: String,
		editer: {type: ObjectId, ref: 'Sfer'}
	}],

	status: { type: Number, default: 0},	// 状态 提交 审核 推荐 黄色 标灰

	creater: {type: ObjectId, ref: 'Sfer'},
	updater: {type: ObjectId, ref: 'Sfer'},
	createAt: {type: Date, default: Date.now()},
	updateAt: {type: Date, default: Date.now()},
});

dbSchema.pre('save', function(next) {
	next();
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;