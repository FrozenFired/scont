let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const colection = 'Ader';
let dbSchema = new Schema({
	code: {
		unique: true,
		type: String
	},
	password: String,

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