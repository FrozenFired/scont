$( function() {
	$("#iptTitle").focus();

	$('#add').submit(function(e) {
		if($("#iptUser").val().length < 10){
			$("#iptUserName").val("Please Refresh")
			e.preventDefault();
		}

		else if($("#iptTitle").val().length == 0){
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