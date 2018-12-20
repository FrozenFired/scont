$( function() {
	$(".datepicker").datepicker();

	$('#subFilter').click(function(e) {
	})

	$("#imgStart").click(function(e) {
		$("#selStartTime").val("")
	})
	$("#imgEnded").click(function(e) {
		$("#selEndedTime").val("")
	})
} );