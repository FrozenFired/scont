let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Task';
let dbSchema = new Schema({
	code: {		// 任务编号
		unique: true,
		type: String
	},
	title: String, // 任务主题
	order: String,	// 订单（如果此任务跟订单相关）
	description: String, // 描述
	note: String,// 备注

	attribs: [{// 我忘记了
		attKey: String,
		attVal: String
	}],

	status: String,
	staff: {type: ObjectId, ref: 'Sfer'},
	createAt: Date,		// 登记到系统时间
	updateAt: Date,		// 登记到系统时间
	finishAt: String,	// 点击完成按钮时间
	startAt: Date, 		// 预计开始时间
	endAt: Date, 		// 预计结束时间
});

dbSchema.pre('save', function(next) {	
	// if(this.isNew) {
	// 	this.updateAt = this.createAt = Date.now();
	// } else {
	// 	this.updateAt = Date.now();
	// }
	next()
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;