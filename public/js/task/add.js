$( function() {
	$("#iptTitle").focus();

	$('#addTask').submit(function(e) {
		if($("#iptTitle").val().length == 0){
			$("#optTitle").show()
			e.preventDefault();
		}
	})

	$("#iptTitle").blur(function(e) {
		if($("#iptTitle").val().length == 0){
			$("#optTitle").show()
		} else {
			$("#optTitle").hide()
		}
	})
} );