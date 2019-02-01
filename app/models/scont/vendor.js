let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Vendor';
let dbSchema = new Schema({
	password: {type: String, default: 0},
	role: {type: Number, default: 1},
	loginTime:  {type: Number, default: 1485100000000},

	code: {unique: true, type: String},
	vtype: Number,
	contacts: [{
		contacter: String,
		tel: String,
		email: String
	}],

	ac: String,
	sa: String,
	acsaNote: String,
	freight: String,
	note: String,

	weight: {type: Number, default: 0},
	status: {type: Number, default: 0},

	sconts: [{type: ObjectId, ref: 'Scont'}],

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