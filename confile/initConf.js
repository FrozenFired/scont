let InitSet = require('./initSet');

// let InitConf = {
// 	ip : "10.10.9.158",
// 	port : 3000,
// 	dbName : 'scont'
// }

function serverUrlSet(port, ip) {
	let url;
	if(port == 80) {
		url = "http://"+ip;
	} else {
		url = "http://"+ip+":" + port;
	}
	return url;
}
let dbUrl = 'mongodb://localhost/' + InitSet.dbName;
// let dbUrl = 'mongodb://' + InitSet.ip + '/' + InitSet.dbName;
let InitConf = {
	port: InitSet.port,
	dbName: InitSet.dbName,
	dbUrl : dbUrl,
	cdn: InitSet.cdn,
	serverUrl : serverUrlSet(InitSet.port, InitSet.ip),
}

module.exports = InitConf