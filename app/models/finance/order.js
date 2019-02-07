let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Float = require('mongoose-float').loadType(mongoose, 2)
let ObjectId = Schema.Types.ObjectId
const colection = 'Order';
let dbSchema = new Schema({
	order: String,
	brand: String,
	vder: {type: ObjectId, ref: 'Vendor'},
	pi: String, // proforma invoice
	note: String,
	ourNote: String,

	taxType: Number,
	staff: String,
	price: Float,
	priceHis: String,
	payAc: {type: ObjectId, ref: 'Pay'},
	payMd: {type: ObjectId, ref: 'Pay'},
	paySa: {type: ObjectId, ref: 'Pay'},

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