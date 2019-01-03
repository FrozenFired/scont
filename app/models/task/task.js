let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Task';
let dbSchema = new Schema({
	code: {
		unique: true,
		type: String
	},
	title: String,
	order: String,
	description: String,
	note: String,

	attribs: [{
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
	if(this.isNew) {
		this.updateAt = this.createAt = Date.now();
	} else {
		this.updateAt = Date.now();
	}
	next()
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;