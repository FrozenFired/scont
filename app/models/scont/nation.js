let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Nation';
let dbSchema = new Schema({
	code: {
		unique: true,
		type: String
	},
	name: String, // 本国名字
	nameEN: String,	// 英语名字
	nameCN: String,	// 中文名字
	tel : String,
	weight:  { type: Number, default: 0 },
	// 添加brand的时候添+1 
	numbrand:  { type: Number, default: 0 },

	creater: {type: ObjectId, ref: 'Sfer'},
	updater: {type: ObjectId, ref: 'Sfer'},
	createAt: { type: Date, default: Date.now()},
	updateAt: { type: Date, default: Date.now()},
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.createAt = this.updateAt = Date.now()
	} else {
		this.updateAt = Date.now()
	}
	next()
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;