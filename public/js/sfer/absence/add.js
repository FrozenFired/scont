$( function() {
	$(".datepicker").datepicker();

	$("#iptDesp").blur(function(e) {
		if($("#iptDesp").val().length < 1) {
			alert('Please complete reason');
		}
	})
	$('#newForm').submit(function(e) {
		if($("#iptDesp").val().length < 1) {
			alert('Please complete reason');
			e.preventDefault();
		}
		else if($("#sAt").val().length <5) {
			alert('Please Select Star Date');
			e.preventDefault();
		}
		else if($("#peAt").val().length <5) {
			alert('Please Select End Date');
			e.preventDefault();
		}
	})
} );