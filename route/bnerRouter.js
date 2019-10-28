let Index = require('../app/controllers/sfer/bner/index');

let Nation = require('../app/controllers/sfer/bner/nation');
let Bcateg = require('../app/controllers/sfer/bner/bcateg');
let Brand = require('../app/controllers/sfer/bner/brand');
let Vendor = require('../app/controllers/sfer/bner/vendor');
let Scont = require('../app/controllers/sfer/bner/scont');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/bner', MdRole.bnerIsLogin, Index.bner);

	app.get('/bnAjaxSfer', MdRole.bnerIsLogin, Index.bnAjaxSfer)

	app.get('/headerBnBrand', MdRole.bnerIsLogin, Brand.brandsFilter, Brand.headerBrand)

	// Nation ------------------------------------------------------------------------------
	app.get('/bnNations', MdRole.bnerIsLogin, Nation.nationsFilter, Nation.nations)
	app.get('/bnNationsPrint', MdRole.bnerIsLogin, Nation.nationsFilter, Nation.nationsPrint)
	app.get('/bnNation/:id', MdRole.bnerIsLogin, Nation.nation)
	app.get('/bnNationUp/:id', MdRole.bnerIsLogin, Nation.nationUp)
	app.post('/bnNationUpd', PostForm, MdRole.bnerIsLogin, Nation.nationUpd)
	app.delete('/bnNationDel', MdRole.bnerIsLogin, Nation.nationDel)
	app.get('/bnNationAdd', MdRole.bnerIsLogin, Nation.nationAdd)
	app.post('/bnNationNew', PostForm, MdRole.bnerIsLogin, Nation.nationNew)
	// Bcateg ------------------------------------------------------------------------------
	app.get('/bnBcategs', MdRole.bnerIsLogin, Bcateg.bcategsFilter, Bcateg.bcategs)
	app.get('/bnBcategsPrint', MdRole.bnerIsLogin, Bcateg.bcategsFilter, Bcateg.bcategsPrint)
	app.get('/bnBcateg/:id', MdRole.bnerIsLogin, Bcateg.bcategFilter, Bcateg.bcateg)
	app.get('/bnBcategPrint/:id', MdRole.bnerIsLogin, Bcateg.bcategFilter, Bcateg.bcategPrint)
	app.get('/bnBcategUp/:id', MdRole.bnerIsLogin, Bcateg.bcategFilter, Bcateg.bcategUp)
	app.post('/bnBcategUpd', PostForm, MdRole.bnerIsLogin, Bcateg.bcategUpd)
	app.delete('/bnBcategDel', MdRole.bnerIsLogin, Bcateg.bcategDel)
	app.get('/bnBcategAdd', MdRole.bnerIsLogin, Bcateg.bcategAdd)
	app.post('/bnBcategNew', PostForm, MdRole.bnerIsLogin, Bcateg.bcategNew)

	// app.get('/ajaxBcateg', MdRole.bnerIsLogin, Bcateg.ajaxBcateg)
	app.get('/ajaxBcateg', Bcateg.ajaxBcateg)

	// Brand ------------------------------------------------------------------------------
	app.get('/bnBrands', MdRole.bnerIsLogin, Brand.brandsFilter, Brand.brands)
	app.get('/bnBrandsPrint', MdRole.bnerIsLogin, Brand.brandsFilter, Brand.brandsPrint)
	app.get('/bnBrand/:id', MdRole.bnerIsLogin, Brand.brandFilter, Brand.brand)
	app.get('/bnBrandDel/:id', MdRole.bnerIsLogin, Brand.brandFilter, Brand.brandDel)
	app.get('/bnBrandUp/:id', MdRole.bnerIsLogin, Brand.brandFilter, Brand.brandUp)
	app.post('/bnBrandUpd', PostForm, MdRole.bnerIsLogin, Brand.brandUpd)
	app.get('/bnBrandAdd', MdRole.bnerIsLogin, Brand.brandAdd)
	app.post('/bnBrandNew', PostForm, MdRole.bnerIsLogin, Brand.brandNew)
	app.delete('/bnBrandDelAjax', MdRole.bnerIsLogin, Brand.brandDelAjax)

	app.get('/ajaxCodeBrand', MdRole.bnerIsLogin, Brand.ajaxCodeBrand)
	app.get('/ajaxBrandSts', MdRole.bnerIsLogin, Brand.ajaxBrandSts)

	// Vendor ------------------------------------------------------------------------------
	app.get('/bnVendors', MdRole.bnerIsLogin, Vendor.vendorsFilter, Vendor.vendors)
	app.get('/bnVendorsPrint', MdRole.bnerIsLogin, Vendor.vendorsFilter, Vendor.vendorsPrint)
	app.get('/bnVendor/:id', MdRole.bnerIsLogin, Vendor.vendorFilter, Vendor.vendor)
	app.get('/bnVendorUp/:id', MdRole.bnerIsLogin, Vendor.vendorFilter, Vendor.vendorUp)
	app.post('/bnVendorUpd', PostForm, MdRole.bnerIsLogin, Vendor.vendorUpd)
	app.delete('/bnVendorDel', MdRole.bnerIsLogin, Vendor.vendorDel)
	app.get('/bnVendorAdd', MdRole.bnerIsLogin, Vendor.vendorAdd)
	app.post('/bnVendorNew', PostForm, MdRole.bnerIsLogin, Vendor.vendorNew)

	app.get('/ajaxCodeVendor', MdRole.bnerIsLogin, Vendor.ajaxCodeVendor)
	app.get('/ajaxVendorSts', MdRole.bnerIsLogin, Vendor.ajaxVendorSts)

	app.get('/ajaxBnVendor', MdRole.bnerIsLogin, Vendor.ajaxVendor) // Order ajax vder

	// Scont ------------------------------------------------------------------------------
	app.get('/bnSconts', MdRole.bnerIsLogin, Scont.scontsFilter, Scont.sconts)
	app.get('/bnScontsPrint', MdRole.bnerIsLogin, Scont.scontsFilter, Scont.scontsPrint)
	app.get('/bnScont/:id', MdRole.bnerIsLogin, Scont.scontFilter, Scont.scont)
	app.get('/bnScontPdf/:id', MdRole.bnerIsLogin, Scont.scontFilter, Scont.scontPdf)
	app.get('/bnScontUp/:id', MdRole.bnerIsLogin, Scont.scontFilter, Scont.scontUp)
	app.post('/bnScontUpd', PostForm, MdRole.bnerIsLogin, Scont.scontUpd)
	app.delete('/bnScontDel', MdRole.bnerIsLogin, Scont.scontDel)
	app.get('/bnScontAdd', MdRole.bnerIsLogin, Scont.scontAdd)
	app.post('/bnScontNew', PostForm, MdRole.bnerIsLogin, Scont.scontNew)

	app.get('/ajaxScontSts', MdRole.bnerIsLogin, Scont.ajaxScontSts)
};