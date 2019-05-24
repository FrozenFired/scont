$( function() {
	$(".datepicker").datepicker();
	$(".selDate").click(function(e) {
		$(".days").toggle();
		$(".day").toggle();
	})

	// 添加 日期 行元素
	let singledateRow = function(timestamp) {
		var time = new Date(timestamp)
		let month = time.getMonth()+1;
		let day = time.getDate();
		let ident = timestamp;
		let elem;
		elem = '<div class="row singleday mt-2 py-2">';
			elem += '<div class="col-6">';
				elem += '<span>'+month+'月'+day+'日'+'</span>';
			elem += '</div>';
			elem += '<div class="col-6 text-warning text-right">';
				elem += '<span id="slen_'+ident+'"></span>';
			elem += '</div>';
		elem += '</div>';

		$('.day').append(elem);
	}
	// 添加object 元素
	let objectRow = function(object, ident) {
		let elem;
		elem = '<div class="card my-3 bg-secondary singleday sdayshow_'+ident+'">';
			elem += '<div class="row p-1 id-'+object._id+'">';
				elem += '<div class="col-12 col-md-4 border-right">';
					let apler = "Loss";
					if(object.apler) apler = object.apler.code;
					elem += '<h4>Applicant: '+apler+'</h4>';
					let car = "Loss";
					if(object.car) car = object.car.code;
					elem += '<h4>Car: '+car+'</h4>';

					let ctAt = getTime(object.ctAt)
					elem += '<p>'+ctAt+'</p>';
				elem += '</div>';
				elem += '<div class="col-12 col-md-4 border-right">';
					if(object.cfmer) {
						cfmer = object.cfmer.code;
						elem += '<h4>Confirm: '+cfmer+'</h4>';
						let sAt = getTime(object.sAt)
						sAtNum = new Date(sAt)
						elem += '<p>'+sAt+'</p>';
					}
				elem += '</div>';
				elem += '<div class="col-12 col-md-4">';
					if(object.ender) {
						ender = object.ender.code;
						elem += '<h4>Confirm: '+ender+'</h4>';
						let eAt = getTime(object.eAt)
						elem += '<p>'+eAt+'</p>';
						eAtNum = new Date(eAt)
						let usageTime = getDuration(parseInt(eAtNum-sAtNum));
						
						elem += '<p>usageTime: '+usageTime+'</p>';
					}
				elem += '</div>';
			elem += '</div>';
		elem += '</div>';
		$('.day').append(elem);
	}
	// 获取objects
	let getsdObjects = function(timestamp) {
		
		let ident = timestamp;
		let bserCode = $("#selWserCode").val();
		$.ajax({
			type: 'GET',
			url: '/sfCaredsAjax?begin=' + timestamp + '&selWserCode='+bserCode
		})
		.done(function(results) {
			if(results.success === 1) {
				let objects = results.objects;
				let len = objects.length;
				$("#slen_"+ident).text(len+' item')
				// alert(objects[0].ctAt)
				for(let i=0; i<len; i++) {
					let object = objects[i];
					objectRow(object, ident);
				}
			}
		})
	}
	$("#dirDate").change(function(e) {
		$('.singleday').remove()
		let timestamp = new Date($(this).val()).setHours(0,0,0,0)
		singledateRow(timestamp);
		getsdObjects(timestamp);
	});

	let dayinit = function() {
		let now = new Date();
		let timestamp = now.setHours(0, 0, 0, 0);
		singledateRow(timestamp);
		getsdObjects(timestamp);
	}
	let getDuration = function(duration) {
		let time = (duration)/1000;
		let dayNum = parseInt(time/(60*60*24));
		lastTime = parseInt(time%(60*60*24))
		let hourNum = parseInt(lastTime/(60*60))
		lastTime = parseInt(lastTime%(60*60))
		let minNum = parseInt(lastTime/60)
		lastTime = parseInt(lastTime%60)
		if(dayNum < 1) dayNum = "";
		else if(dayNum == 1) dayNum = dayNum + "day ";
		else dayNum = dayNum + "days ";

		if(hourNum < 1) hourNum = "";
		else if(hourNum == 1) hourNum = hourNum + "hour ";
		else hourNum = hourNum + "hours ";

		if(minNum < 1) minNum = "";
		else if(minNum == 1) minNum = minNum + "minute";
		else minNum = minNum + "minutes";
		usageTime = dayNum+hourNum+minNum;
		return usageTime
	}
	let getTime = function(timestamp) {
		let date = new Date(timestamp);
		Y = date.getFullYear() + '-';
		M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		D = date.getDate() + ' ';
		h = date.getHours() + ':';
		m = date.getMinutes() + ':';
		s = date.getSeconds(); 
		return Y+M+D+h+m+s;
	}
	dayinit();
} );