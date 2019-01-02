let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const colection = 'Sfer';
let dbSchema = new Schema({
	code: {
		unique: true,
		type: String
	},
	password: String,
	role: { type: Number, default: 2 },
	
	name: String,
	photo: {
		type: String,
		default: '/upload/avatar/sfer/1.jpg'
	},

	telephone: String,
	document: String,
	address: String,		// Via Orsiera 30
	post: String,			// 10141 TO Torino, Italia
	ivaNumber: String,

	home: String,


	loginTime:  {
		type: Number,
		default: 1485100000000
	},

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