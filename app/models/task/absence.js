let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Absence';
let dbSchema = new Schema({
	apler: {type: ObjectId, ref: 'Sfer'},
	role: Number,// 所属部门，方便部门查看
	desp: String,
	sAt: Date,
	peAt: Date,

	manage: {type: ObjectId, ref: 'Sfer'},
	hr: {type: ObjectId, ref: 'Sfer'},
	eAt: Date,
	duration:String,
	note: String,

	status: Number,
	ctAt: Date,
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.ctAt = Date.now();
	}
	next()
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;