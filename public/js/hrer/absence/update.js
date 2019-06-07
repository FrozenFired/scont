$( function() {
	$(".datepicker").datepicker();
	$("#iptNote").val($("#txtNote").val())
	$("#iptDuration").blur(function() {
		let duration = parseFloat($(this).val());
		let judge = parseInt(duration*10)
		if(isNaN(duration)) {
			alert('Please Complete duration');
			$("#iptDuration").val("")
		} else if(duration < 0.5 || judge%5 > 0) {
			alert('duration is not right');
		} else {
			$("#iptDuration").val(duration)
		}
	})

	$('#formUpd').submit(function(e) {
		let duration = parseFloat($("#iptDuration").val());
		let judge = parseInt(duration*10)

		if(isNaN(duration)) {
			alert('Please Complete duration');
			e.preventDefault();
		} else if(duration < 0.5 || judge%5 > 0) {
			alert('duration is not right');
			e.preventDefault();
		} else if($("#eAt").val().length <5) {
			alert('Please Select End Date');
			e.preventDefault();
		}
	})
} );