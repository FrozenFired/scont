$(function() {
	$("#iptSctScont").blur(function(e) {
		if($(this).val().length < 1) {
			$("#optSctScont").text("Complete")
		} else {
			$("#optSctScont").text("")
		}
	})
	$("#iptSctCause").change(function(e) {
		if($(this).val() < 0) {
			$("#optSctCause").text("Select")
		} else {
			$("#optSctCause").text("")
		}
	})
})