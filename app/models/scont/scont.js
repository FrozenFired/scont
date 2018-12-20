let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Scont';
let dbSchema = new Schema({
	cause: Number,
	
	brand: {type: ObjectId, ref: 'Brand'},
	vendor: {type: ObjectId, ref: 'Vendor'},

	scont: String,
	sctNote: String,

	note: String,

	status: { type: Number, default: 0},

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