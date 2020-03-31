let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId
const colection = 'Bcateg';
let dbSchema = new Schema({
	code: {		// 分类名称。 比如：PELLI
		unique: true,
		type: String
	},
	nameEN: String,	// 此分类的英文名称
	nameCN: String,	// 分类的中文名称

	weight: { type: Number, default: 0 },	// 权重， 排序用的

	bcate: Number,	// 对应的一级分类
	
	// 添加brandquot的时候添加进来
	numbrand:  { type: Number, default: 0 },	// 分类中包含的品牌数量
	
	creater: {type: ObjectId, ref: 'Sfer'},		// 创建者
	updater: {type: ObjectId, ref: 'Sfer'},		// 最近更新者
	createAt: { type: Date, default: Date.now() },	// 创建的时间
	updateAt: { type: Date, default: Date.now() },	// 最近更新的时间
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.createAt = this.updateAt = Date.now();
	} else {
		this.updateAt = Date.now();
	}
	next();
});

let db = mongoose.model(colection, dbSchema);

module.exports = db;