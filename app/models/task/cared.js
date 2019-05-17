let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Cared';
let dbSchema = new Schema({
	desp: String,
	car: {type: ObjectId, ref: 'Car'},
	apler: {type: ObjectId, ref: 'Sfer'},
	ctAt: Date,

	cfmer: {type: ObjectId, ref: 'Sfer'},
	sAt: Date,

	ender: {type: ObjectId, ref: 'Sfer'},
	eAt: Date,

	note: String,
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.ctAt = Date.now();
	}
	next()
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;