let randNum = 1546484;
exports.at = function(req) {
	let at = new Object()
	at.slipCond = "";

	if(req.query.crtStart && req.query.crtStart.length == 10){
		at.symCrtStart = "$gte";   // $ ne eq gte gt lte lt
		at.condCrtStart = new Date(req.query.crtStart).setHours(0,0,0,0);
		at.slipCond += "&crtStart="+req.query.crtStart;
	} else {
		at.symCrtStart = "$ne";
		at.condCrtStart = randNum;
	}

	if(req.query.crtEnded && req.query.crtEnded.length == 10){
		at.symCrtEnded = "$lte";
		at.condCrtEnded = new Date(req.query.crtEnded).setHours(23,59,59,0);
		at.slipCond += "&crtEnded="+req.query.crtEnded;
	} else {
		at.symCrtEnded = "$ne";
		at.condCrtEnded = randNum;
	}
	// 选择更新的开始时间

	if(req.query.updStart && req.query.updStart.length == 10){
		at.symUpdStart = "$gte";
		at.condUpdStart = new Date(req.query.updStart).setHours(0,0,0,0);
		at.slipCond += "&updStart="+req.query.updStart;
	} else {
		at.symUpdStart = "$ne";
		at.condUpdStart = randNum;
	}
	// 选择更新的结束时间

	if(req.query.updEnded && req.query.updEnded.length == 10){
		at.symUpdEnded = "$lte";
		at.condUpdEnded = new Date(req.query.updEnded).setHours(23,59,59,0)
		at.slipCond += "&updEnded="+req.query.updEnded;
	} else {
		at.symUpdEnded = "$ne";
		at.condUpdEnded = randNum;
	}

	return at;
}

exports.cs = function(req) {
	let cs = new Object()
	cs.slipCond = "";
	// 选择付首款开始时间
	if(req.query.acStart && req.query.acStart.length == 10){
		cs.symAcStart = "$gte";   // $ ne eq gte gt lte lt
		cs.condAcStart = new Date(req.query.acStart).setHours(0,0,0,0);
		cs.slipCond += "&acStart="+req.query.acStart;
	} else {
		cs.symAcStart = "$ne";
		cs.condAcStart = randNum;
	}
	// 选择付首款结束时间
	if(req.query.acEnded && req.query.acEnded.length == 10){
		cs.symAcEnded = "$lte";
		cs.condAcEnded = new Date(req.query.acEnded).setHours(23,59,59,0)
		cs.slipCond += "&acEnded="+req.query.acEnded;
	} else {
		cs.symAcEnded = "$ne";
		cs.condAcEnded = randNum;
	}
	
	// 选择付尾款开始时间
	if(req.query.saStart && req.query.saStart.length == 10){
		cs.symSaStart = "$gte";
		cs.condSaStart = new Date(req.query.saStart).setHours(0,0,0,0);
		cs.slipCond += "&saStart="+req.query.saStart;
	} else {
		cs.symSaStart = "$ne";
		cs.condSaStart = randNum;
	}
	// 选择付尾款结束时间
	if(req.query.saEnded && req.query.saEnded.length == 10){
		cs.symSaEnded = "$lte";
		cs.condSaEnded = new Date(req.query.saEnded).setHours(23,59,59,0)
		cs.slipCond += "&saEnded="+req.query.saEnded;
	} else {
		cs.symSaEnded = "$ne";
		cs.condSaEnded = randNum;
	}

	return cs;
}

exports.status = function(reqSts, initSts, slipCond) {
	let condStatus;
	if(!reqSts) {
		condStatus = initSts;
	} else {
		condStatus = reqSts
	}
	if(condStatus instanceof Array){
		for(status in condStatus){
			slipCond += "&status="+condStatus[status];
		}
	} else {
		condStatus = [condStatus];
		slipCond += "&status="+condStatus;
	}
	return [condStatus, slipCond]
}
exports.method = function(reqMethod, initMethod, slipCond) {
	let condMethod;
	if(!reqMethod || reqMethod == initMethod){
		symMethod = "$ne";
		condMethod = initMethod;
	} else{
		symMethod = "$eq";   // $ ne eq gte gt lte lt
		condMethod = reqMethod;
		slipCond += "&method="+reqMethod;
	}
	return [symMethod, condMethod, slipCond];
}
exports.creater = function(reqCreater, initCreater, slipCond) {
	let condCreater;
	if(!reqCreater || reqCreater == initCreater){
		symCreater = "$ne";
		condCreater = initCreater;
	} else{
		symCreater = "$eq";   // $ ne eq gte gt lte lt
		condCreater = reqCreater;
		slipCond += "&creater="+reqCreater;
	}
	return [symCreater, condCreater, slipCond];
}

exports.key = function(req, initType, initWord, slipCond) {
	let keytype = initType, keyword = initWord;
	if(req.query.keytype) { 
		keytype = req.query.keytype;
		slipCond += "&keytype="+keytype;
	}

	if(req.query.keyword) {
		keyword = req.query.keyword.replace(/(\s*$)/g, "").replace( /^\s*/, '');
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