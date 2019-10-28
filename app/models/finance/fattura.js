let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Float = require('mongoose-float').loadType(mongoose, 2);
let ObjectId = Schema.Types.ObjectId;
const colection = 'Fattura';
let dbSchema = new Schema({
	code: Number, // 格式 number/year
	year: Number,
	type: Number,
	goods: [{
		code: String,
		desp: String,
		hs: String,
		quot: Number,
		price: Float,
		tot: Float,
		brand: String,
		order: String,
		Brand: {type: ObjectId, ref: 'Brand'},
		Order: {type: ObjectId, ref: 'Order'},
	}],
	total: Float,

	/* ----------- general Fattura ----------- */
	facs: [{			// from ac fattura
		ac: {type: ObjectId, ref: 'Fattura'},
		code: String,
		ctAt: String,
		rmd: Float,
	}],
	paid: Float,
	imp: Float,	
	/* ----------- general Fattura ----------- */

	/* ----------- ac Fattura ----------- */
	tfs: [{				// to fattura
		ftr: {type: ObjectId, ref: 'Fattura'},
		cost: Float,
	}],
	rmd: Float,
	/* ----------- ac Fattura ----------- */

	ctAuto: Date,

	ctAt: Date,
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		this.ctAt = Date.now()
	}
	next();
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;