let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Brand';
let dbSchema = new Schema({
	code: {
		unique: true,
		type: String
	},
	nation: {type: ObjectId, ref: 'Nation'},
	bcateg: {type: ObjectId, ref: 'Bcateg'},
	matDesp: String, // 自定义 三级分类
	website: String,
	webNote: String,
	firmName: String, 

	iva: String,
	plist: Boolean, // pricelist
	plNote: String, // pricelist Note
	atlas: Boolean, // cataloglist
	atNote: String,	// cataloglist Note

	pTime: String, // productTime

	cartace: Number,
	video: Number,

	status: {type: Number, default: 0},
	sconts: [{type: ObjectId, ref: 'Scont'}],
	
	weight: {type: Number, default: 0},
	creater: {type: ObjectId, ref: 'Sfer'},
	updater: {type: ObjectId, ref: 'Sfer'},
	
	createAt: { type: Date, default: Date.now() },
	updateAt: { type: Date, default: Date.now() },
});

dbSchema.pre('save', function(next) {	
	next();
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;