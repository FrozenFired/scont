$( function() {
	let iptImg;
	let iptOrder;
	let iptBrand;

	$('.img').click(function(e) {
		let imgsrc = $(this)[0].src;
		$('#iptImg').attr('src', imgsrc)
	})

	let showPrint = function(num, qt) {
		for(let i=0; i<qt; i++) {
			let numb = num+i;
			let str = "";
			str += '<div class="row prtAft prints">';
				str += '<div class="col-12 text-center">';
					str += '<img src='+iptImg+' width="300px" height="240px" >';
				str += '</div>';
				str += '<div class="col-12 text-center">';
					str += iptOrder;
				str += '</div>';
				str += '<div class="col-12 text-center">';
					str += iptBrand;
				str += '</div>';
				str += '<div class="col-12 text-center">';
					str += numb;
				str += '</div>';
			str += '</div>';

			$("#print").append(str)
		}
	}

	$('#preview').click(function(e) {
		// $("#set").hide()
		iptImg = $('#iptImg')[0].src;
		iptOrder = $('#iptOrder').val();
		iptBrand = $('#iptBrand').val();
		let iptNumber = parseInt($('#iptNumber').val());
		let iptQuant = parseInt($('#iptQuant').val());

		if(isNaN(iptNumber)) {
			$("#optNumber").text('Must Number')
		} else if(isNaN(iptQuant)) {
			$("#optQuant").text('Must Number')
		} else {
			showPrint(iptNumber, iptQuant)
		}
	})

	$("#iptNumber").blur(function(e) {
		let iptNumber = parseInt($(this).val())
		if(isNaN(iptNumber)) {
			$("#optNumber").text('Must Number')
		} else {
			$("#optNumber").text('')
			$(this).val(iptNumber)
		}
	})

	$("#iptQuant").blur(function(e) {
		let pt = parseInt($(this).val())
		if(isNaN(pt)) {
			$("#optQuant").text('Must Number')
		} else {
			$("#optQuant").text('')
			$(this).val(pt)
		}
	})

	
} );