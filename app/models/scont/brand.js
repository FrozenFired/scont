let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Brand';
let dbSchema = new Schema({
	code: {		// 品牌名。 比如poliform
		unique: true,
		type: String
	},
	nation: {type: ObjectId, ref: 'Nation'},	// 所属国家
	firmName: String, 							// 公司名称
	bcateg: {type: ObjectId, ref: 'Bcateg'},	// 所属分类
	matDesp: String, // 自定义 材料 描述
	website: String,	// 网址
	webNote: String,	// 网址备注

	iva: String,		// iva
	plist: Boolean, // pricelist 此品牌是否有价格列表
	plNote: String, // pricelist Note 价格列表备注
	atlas: Boolean, // cataloglist	是否有图册列表
	atNote: String,	// cataloglist Note 图册列表备注

	pTime: String, // productTime	// 运货时间

	cartace: Number,	// 不记得了 不重要
	video: Number,		// 此品牌的视频数量，也不重要

	status: {type: Number, default: 0},	// 品牌状态 提交 审核 灰色
	weight: {type: Number, default: 0},	// 权重 排序用的
	
	sconts: [{type: ObjectId, ref: 'Scont'}],	// 折扣信息
	
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