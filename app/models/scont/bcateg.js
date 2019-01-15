let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Bcateg';
let dbSchema = new Schema({
	code: {
		unique: true,
		type: String
	},
	nameEN: String,
	nameCN: String,

	weight: { type: Number, default: 0 },

	bcate: Number,
	
	// 添加brandquot的时候添加进来
	numbrand:  { type: Number, default: 0 },
	
	creater: {type: ObjectId, ref: 'Sfer'},
	updater: {type: ObjectId, ref: 'Sfer'},
	createAt: { type: Date, default: Date.now() },
	updateAt: { type: Date, default: Date.now() },
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