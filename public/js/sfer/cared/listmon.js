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
			elem += '<div class="row p-1">';
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
						elem += '<p>'+sAt+'</p>';
					}
				elem += '</div>';
				elem += '<div class="col-12 col-md-4">';
					if(object.ender) {
						ender = object.ender.code;
						elem += '<h4>Confirm: '+ender+'</h4>';
						let eAt = getTime(object.eAt)
						elem += '<p>'+eAt+'</p>';
					}
				elem += '</div>';
			elem += '</div>';
		elem += '</div>';
		$('.month').append(elem);
	}

	// 添加 正在加载 元素
	let loading = function() {
		let elem;
		elem = '<div class="loading text-warning text-center mt-3">';
			elem += '<h4>请稍后，正在加载...</h4>';
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
			url: '/sfCaredsMonthAjax?begin=' + begin + '&ended=' + ended + '&selWserCode='+bserCode
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