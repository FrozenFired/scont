$( function() {
	$(".datepicker").datepicker();

	$("#labPaidS").click(function(e) {
		$("#paidS").val("")
	})
	$("#labPaidF").click(function(e) {
		$("#paidF").val("")
	})
	$("#labCrtS").click(function(e) {
		$("#crtS").val("")
	})
	$("#labCrtF").click(function(e) {
		$("#crtF").val("")
	})
} );