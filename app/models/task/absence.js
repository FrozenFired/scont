let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Absence';
let dbSchema = new Schema({
	apler: {type: ObjectId, ref: 'Sfer'},	// 申请人
	role: Number,// 所属部门，方便部门查看
	desp: String,// 描述
	sAt: Date,	// 开始时间
	peAt: Date,// 结束时间

	manage: {type: ObjectId, ref: 'Sfer'},	// 确认的负责人
	hr: {type: ObjectId, ref: 'Sfer'},		// 确认的hr
	eAt: Date,				// 实际结束时间
	duration:String,		// 间隔多久
	note: String,		// 备注

	status: Number,	// 状态
	ctAt: Date,		// 创建时间
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.ctAt = Date.now();
	}
	next()
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;