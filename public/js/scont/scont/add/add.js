$(function() {
	$('#addScont').submit(function(e) {
		if($("#scontBrand").val().length < 2) {
			$("#alertBrand").show()
			e.preventDefault();
		}
		else if($("#scontVendor").val().length < 2) {
			$("#alertVendor").show()
			e.preventDefault();
		}
		else if($("#iptSctScont").val().length < 1) {
			$("#optSctScont").text("Complete")
			e.preventDefault();
		}
		else if($("#iptSctCause").val() < 0) {
			$("#optSctCause").text("Select")
			e.preventDefault();
		}
	})
})