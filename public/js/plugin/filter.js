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

	$("#imgAcStart").click(function(e) {
		$("#acStartTime").val("")
	})
	$("#imgAcEnded").click(function(e) {
		$("#acEndedTime").val("")
	})

	$("#imgSaStart").click(function(e) {
		$("#saStartTime").val("")
	})
	$("#imgSaEnded").click(function(e) {
		$("#saEndedTime").val("")
	})
} );