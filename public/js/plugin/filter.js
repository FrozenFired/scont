$( function() {
	$(".datepicker").datepicker();

	$("#imgCrtStart").click(function(e) {
		$("#crtStartTime").val("")
	})
	$("#imgCrtEnded").click(function(e) {
		$("#crtEndedTime").val("")
	})

	$("#imgUpdStart").click(function(e) {
		$("#updStartTime").val("")
	})
	$("#imgUpdEnded").click(function(e) {
		$("#updEndedTime").val("")
	})
} );