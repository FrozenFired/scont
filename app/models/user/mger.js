let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const colection = 'Mger';
let dbSchema = new Schema({
	code: {
		unique: true,
		type: String
	},
	password: String,
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;