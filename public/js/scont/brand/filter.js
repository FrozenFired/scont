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

	$('#subBrandFilter').submit(function(e) {
		if($("#fKeyword").val().length < 1) {
			$("#fKeyword").remove();
		}

		if($("#crtStartTime").val().length < 1) {
			$("#crtStartTime").remove();
		}
		if($("#crtEndedTime").val().length < 1) {
			$("#crtEndedTime").remove();
		}
		if($("#updStartTime").val().length < 1) {
			$("#updStartTime").remove();
		}
		if($("#updEndedTime").val().length < 1) {
			$("#updEndedTime").remove();
		}
		
	})
} );