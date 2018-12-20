let bcrypt = require('bcryptjs');
let SALT_WORK_FACTOR = 10;

exports.rqBcrypt = function(req, res, next) {
	let password = req.body.object.password.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);
		bcrypt.hash(password, salt, function(err, hash) {
			if(err) return next(err);
			req.body.object.password = hash;
			next();
		});
	});
};