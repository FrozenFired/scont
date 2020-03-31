let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Float = require('mongoose-float').loadType(mongoose, 2)
let ObjectId = Schema.Types.ObjectId
const colection = 'Order';
let dbSchema = new Schema({
	order: String,			// 订单号
	brand: String,			// 品牌名
	vder: {type: ObjectId, ref: 'Vendor'},	// 供应商
	pi: String, // proforma invoice	// 形式发票号
	note: String,		// 备注
	ourNote: String,	// 公司备注

	taxType: Number,	// 免税方式
	staff: String,		// 报价员工名字
	price: Float,		// 订单价格
	priceHis: String,	// 价格更改记录
	payAc: {type: ObjectId, ref: 'Pay'},	// 首款
	payMd: {type: ObjectId, ref: 'Pay'},	// 中款
	paySa: {type: ObjectId, ref: 'Pay'},	// 尾款

	status: String,					// 订单状态
	stsOrderLg: {type: Number, default: 0},	// 物流状态

	volumeLg: Float,				// 订单物品的体积
	gwlg: Number, // gross weight 毛重
	nwlg: Number, // net weight 净重
	packlg: Number, // 箱子个数

	creater: {type: ObjectId, ref: 'Sfer'},
	updater: {type: ObjectId, ref: 'Sfer'},
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