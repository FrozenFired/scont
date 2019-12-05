$( function() {
	$(".selDate").click(function(e) {
		$(".months").toggle();
		$(".month").toggle();
	})

	// 添加 日期 行元素
	let singledateRow = function(ym, begin, ended) {
		let ident = begin;
		let elem;
		elem = '<div class="row singlemonth mt-2 py-2">';
			elem += '<div class="col-6">';
				elem += '<span>'+ym+'</span>';
			elem += '</div>';
			elem += '<div class="col-6 text-warning text-right">';
				elem += '<span id="slen_'+ident+'"></span>';
			elem += '</div>';
		elem += '</div>';

		$('.month').append(elem);
	}
	// 添加Object 元素
	let objectRow = function(object, ident) {
		let elem;
		elem = '<div class="card my-3 bg-secondary singlemonth smonthshow_'+ident+'">';
			elem += '<div class="row p-1 id-'+object._id+'">';
				elem += '<div class="col-12 col-md-6 border-right">';
					let apler = "Loss", aplerId="";
					if(object.apler) {
						apler = object.apler.code;
						aplerId = object.apler._id;
					}
					elem += '<h5><b>Applicant: <a href="/hrAbsenceAll/'+aplerId+'">'+apler+'</a></b></h5>';
					elem += '<h6>[ reason: '+object.desp+' ]</h6>';
					let sAt = getTime(object.sAt)
					elem += '<div>Start At: '+sAt+'</div>';
					let peAt = getTime(object.peAt)
					elem += '<div>pre End: '+peAt+'</div>';

					let ctAt = getTime(object.ctAt)
					elem += '<div class="mt-2">Apply At: '+ctAt+'</div>';
				elem += '</div>';
				elem += '<div class="col-12 col-md-6">';
					if(object.manage) {
						manage = object.manage.code;
						elem += '<h5><b>Manager: '+manage+'</b></h5>';
					}
					if(object.hr) {
						hr = object.hr.code;
						elem += '<h5><b>HR: '+hr+'</b></h5>';
						if(object.duration) {
							elem += '<h6>[ Duration: '+object.duration+' ]</h6>';						
						}
						if(object.note) {
							elem += '<h6>[ Note: '+object.note+' ]</h6>';						
						}
						elem += '<a href="/hrAbsenceUp/'+object._id+'" > Edit</a>'
					}
					elem += '<div class="mt-2">status: '+object.status+'</div>';
				elem += '</div>';
			elem += '</div>';
		elem += '</div>';
		$('.month').append(elem);
	}
	// 添加 正在加载 元素
	let loading = function() {
		let elem;
		elem = '<div class="loading text-warning text-center mt-3">';
			elem += '<h5>请稍后，正在加载...</h5>';
		elem += '</div>';
		$('.month').append(elem);
	}
	// 获取objects
	let getsdObjects = function(begin, ended) {
		loading();

		let ident = begin;
		let bserCode = $("#selWserCode").val();
		$.ajax({
			type: 'GET',
			url: '/hrAbsencesMonthAjax?begin=' + begin + '&ended=' + ended + '&selWserCode='+bserCode
		})
		.done(function(results) {
			if(results.success === 1) {
				let objects = results.objects;
				let len = objects.length;
				$("#slen_"+ident).text(len+' item')
				// console.log(results.objects)
				// alert(objects[0].ctAt)
				for(let i=0; i<len; i++) {
					let object = objects[i];
					objectRow(object, ident);
				}

				$('.loading').remove();
			} else {

			}
		})
	}
	$("#selMonth").change(function(e) {
		$('.singlemonth').remove()
		let strs = $("#selMonth").val().split('-');
		// alert(strs)
		let ym = strs[0];
		let begin = parseInt(strs[1]);
		let ended = parseInt(strs[2]);
		singledateRow(ym, begin, ended);
		getsdObjects(begin, ended);
	});

	let monthinit = function() {
		let strs = $("#selMonth").val().split('-');
		let ym = strs[0];
		let begin = parseInt(strs[1]);
		let ended = parseInt(strs[2]);
		singledateRow(ym, begin, ended);
		getsdObjects(begin, ended);
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
	monthinit();
} );