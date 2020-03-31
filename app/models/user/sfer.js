let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const colection = 'Sfer';
// 员工数据库集合
let dbSchema = new Schema({
	code: {	// 帐号
		unique: true,
		type: String
	},
	password: String,	// 密码

	/* 这两个反了 */
	role: { type: Number, default: 2 },		// 部门
	part: { type: Number, default: 0 }, // 员工角色
	
	name: String,	// 用户名
	photo: {		// 头像
		type: String,
		default: '/upload/avatar/sfer/1.jpg'
	},

	telephone: String,		// 电话
	document: String,		// 证件号
	address: String,		// 地址
	post: String,			// 10141 TO Torino, Italia
	ivaNumber: String,		// iva号码

	home: String,			// 主页地址


	loginTime:  {			// 最近登录时间
		type: Number,
		default: 1485100000000
	},

	createAt: Date,			// 创建时间
	updateAt: Date,			// 最近更新时间
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