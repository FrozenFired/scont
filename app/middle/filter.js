exports.at = function(req) {
	let at = new Object()
	at.slipCond = "";

	if(req.query.crtStart && req.query.crtStart.length == 10){
		at.symCrtStart = "$gt";   // $ ne eq gte gt lte lt
		at.condCrtStart = new Date(req.query.crtStart).setHours(0,0,0,0);
		at.slipCond += "&crtStart="+req.query.crtStart;
	} else {
		at.symCrtStart = "$ne";
		at.condCrtStart = null;
	}

	if(req.query.crtEnded && req.query.crtEnded.length == 10){
		at.symCrtEnded = "$lt";
		at.condCrtEnded = new Date(req.query.crtEnded).setHours(23,59,59,0)
		at.slipCond += "&crtEnded="+req.query.crtEnded;
	} else {
		at.symCrtEnded = "$ne";
		at.condCrtEnded = null;
	}
	// 选择更新的开始时间

	if(req.query.updStart && req.query.updStart.length == 10){
		at.symUpdStart = "$gt";
		at.condUpdStart = new Date(req.query.updStart).setHours(0,0,0,0);
		at.slipCond += "&updStart="+req.query.updStart;
	} else {
		at.symUpdStart = "$ne";
		at.condUpdStart = null;
	}
	// 选择更新的结束时间

	if(req.query.updEnded && req.query.updEnded.length == 10){
		at.symUpdEnded = "$lt";
		at.condUpdEnded = new Date(req.query.updEnded).setHours(23,59,59,0)
		at.slipCond += "&updEnded="+req.query.updEnded;
	} else {
		at.symUpdEnded = "$ne";
		at.condUpdEnded = null;
	}

	return at;
}

exports.status = function(reqSts, initSts, slipCond) {
	let condStatus;
	if(!reqSts) {
		// console.log("not req")
		condStatus = initSts;
	} else {
		// console.log("yes req")
		condStatus = reqSts
	}

	if(condStatus instanceof Array){
		// console.log("not Array")
		for(status in condStatus){
			slipCond += "&status="+condStatus[status];
		}
	} else {
		// console.log("yes Array")
		condStatus = [condStatus];
		slipCond += "&status="+condStatus;
	}

	return [condStatus, slipCond]
}

exports.key = function(req, initType, initWord, slipCond) {
	let keytype = initType, keyword = initWord;
	if(req.query.keytype) { 
		keytype = req.query.keytype;
		slipCond += "&keytype="+keytype;
	}

	if(req.query.keyword) {
		keyword = req.query.keyword.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		slipCond += "&keyword="+keyword;
	}

	return [keytype, keyword, slipCond]
}


exports.slipPage = function(req, initEntry, slipCond) {
	let entry = parseInt(req.query.entry) || initEntry;
	if(isNaN(entry)) {
		entry = initEntry;
	} else if(entry != initEntry) {
		if(entry < 0) entry = -entry;
		slipCond += "&entry="+entry;
	}
	let page = parseInt(req.query.page) || 0;

	return [entry, page, slipCond]
}