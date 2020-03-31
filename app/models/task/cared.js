let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Cared';
let dbSchema = new Schema({
	desp: String,	// 申请描述
	car: {type: ObjectId, ref: 'Car'}, // 申请的汽车
	apler: {type: ObjectId, ref: 'Sfer'}, // 申请人
	ctAt: Date,		// 申请创建时间

	cfmer: {type: ObjectId, ref: 'Sfer'},	// 确认人
	sAt: Date,	// 开始时间

	ender: {type: ObjectId, ref: 'Sfer'},// 钥匙接收人
	eAt: Date,// 结束时间

	note: String, // 备注
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.ctAt = Date.now();
	}
	next()
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;