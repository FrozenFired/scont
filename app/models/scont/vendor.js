let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Float = require('mongoose-float').loadType(mongoose, 2);
let ObjectId = Schema.Types.ObjectId
const colection = 'Vendor';
let dbSchema = new Schema({
	password: {type: String, default: 0},	// 密码
	role: {type: Number, default: 1},		// 是否能够登录
	loginTime:  {type: Number, default: 1485100000000},

	taxFree: Float,							// 免税余额

	code: {unique: true, type: String},		// 帐号
	vtype: Number,							// 供应商类型
	contacts: [{							// 联系人
		contacter: String,
		tel: String,
		email: String
	}],

	ac: String,								// 首款比例
	sa: String,								// 尾款比例
	acsaNote: String,						// 首位款比例备注
	freight: String,						// 运输方式
	note: String,							// 备注

	weight: {type: Number, default: 0},
	status: {type: Number, default: 0},

	sconts: [{type: ObjectId, ref: 'Scont'}],	// 此供应商下品牌的折扣信息

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