let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Car';
let dbSchema = new Schema({
	code: {
		unique: true,
		type: String
	},
	nome: String,
	desp: String,

	status: Number,
	apler: {type: ObjectId, ref: 'Sfer'},
	cared: {type: ObjectId, ref: 'Cared'},

	photo: {
		type: String,
		default: '/upload/car/1.jpg'
	},

	createAt: Date,
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.createAt = Date.now();
	}
	next()
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;