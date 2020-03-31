let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Float = require('mongoose-float').loadType(mongoose, 2);
let ObjectId = Schema.Types.ObjectId;
const colection = 'Fattura';
let dbSchema = new Schema({
	code: Number, // 格式 number/year 发票号
	year: Number,	// 年
	type: Number,	// 类型
	goods: [{		// 货物
		code: String, // 货物号
		desp: String,	// 货物描述
		hs: String,	// 不记得了 不重要
		quot: Number,	// 数量
		price: Float,	// 价格
		tot: Float,		// 数量×价格
		brand: String, // 品牌
		order: String,	// 订单号
		Brand: {type: ObjectId, ref: 'Brand'}, // 关联品牌
		Order: {type: ObjectId, ref: 'Order'},	// 关联订单
	}],
	total: Float,	// 总价

	/* ----------- general Fattura ----------- */
	facs: [{			// from ac fattura 订单发票
		ac: {type: ObjectId, ref: 'Fattura'},
		pay: Float,
	}],
	paid: Float,
	imp: Float,	

	/* ----------- 运输发票 Fattura ----------- */
	tfs: [{				// to fattura
		ftr: {type: ObjectId, ref: 'Fattura'},
		cost: Float,
	}],
	rmd: Float,	// 剩余价格

	ctAuto: Date,		// 手动更改时间

	ctAt: Date,			// 创建时间
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		this.ctAt = Date.now()
	}
	next();
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;