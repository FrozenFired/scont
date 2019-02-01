let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Float = require('mongoose-float').loadType(mongoose, 2)
let ObjectId = Schema.Types.ObjectId
const colection = 'Payment';
let dbSchema = new Schema({
	vder: {type: ObjectId, ref: 'Vendor'},
	order: String,
	pi: String, // proforma invoice
	brand: String,
	note: String,
	ourNote: String,

	price: Float,
	ac: Float,
	acAt: Date,
	acer: {type: ObjectId, ref: 'Sfer'},
	sa: Float,
	saAt: Date,
	saer: {type: ObjectId, ref: 'Sfer'},

	status: String,
	creater: {type: ObjectId, ref: 'Sfer'},
	updater: {type: ObjectId, ref: 'Sfer'},
	createAt: Date,
	updateAt: Date,
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