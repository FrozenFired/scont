$( function() {
	let iptImg;
	let iptOrder;
	let iptBrand;

	$('.img').click(function(e) {
		let imgsrc = $(this)[0].src;
		$('#iptImg').attr('src', imgsrc)
	})

	let showPrint = function(num, qt) {
		// $("#print").append('<div class="row prtAft"></div>')
		for(let i=0; i<qt; i++) {
			let numb = num+i;
			let str = "";
			str += '<div class="row prtAft prints text-center mt-5" style="font-size:20px">';
				str += '<div class="col-12">';
					str += '<img src='+iptImg+' width="180px" height="80px" >';
				str += '</div>';
				str += '<div class="col-12"><strong>';
					str += iptBrand;
				str += '</strong></div>';
				str += '<div class="col-12"><strong>';
					str += iptOrder;
				str += '</strong></div>';
				str += '<div class="col-12"><strong> N. ';
					str += numb;
				str += '</strong></div>';
			str += '</div>';

			$("#print").append(str)
		}
	}

	$('#preview').click(function(e) {
		$("#set").hide()
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