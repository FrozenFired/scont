$( function() {
	$(".datepicker").datepicker();

	$("#iptMethod").change(function(e) {
		let meth = $(this).val();
		if(meth < 0) {
			$("#optMethod").show();
		} else {
			$("#optMethod").hide();
			if(meth == 1) {
				$("#assegnoCode").show();
			} else {
				$("#iptAssegnoCode").val("")
				$("#assegnoCode").hide();
			}
		}
	})


	$("#iptPayPrice").blur(function(e) {
		let price = $(this).val();
		// 突然想自己写个逻辑，就没有用正则
		if(isFloat(price)) {
			$("#optPayPrice").hide();
		} else {
			$("#optPayPrice").show();
		}
	})
	$("#iptCrtAt").change(function(e) {
		if( ($(this).val()).length != 10) {
			$("#optCrtAt").show();
		} else {
			$("#optCrtAt").hide();
		}
	})
	$("#iptPaidAt").change(function(e) {
		if( ($(this).val()).length != 10) {
			$("#optPaidAt").show();
		} else {
			$("#optPaidAt").hide();
		}
	})
	// let now = new Date();
	// let month = String(now.getMonth()+1);
	// if(month.length==1) month= '0'+month;
	// let today = parseInt(now.getFullYear()+month+now.getDate())

	$("#fnUpPay").submit(function(e) {
		if(!isFloat($("#iptPayPrice").val())) {
			$("#optPayPrice").show();
			e.preventDefault();
		}
		else if($("#iptMethod").val() < 0) {
			$("#optMethod").show();
			e.preventDefault();
		}
		else if(($("#iptCrtAt").val()).length != 10) {
			$("#optCrtAt").show();
			e.preventDefault();
		}
		else if(($("#iptPaidAt").val()).length != 10) {
			$("#optPaidAt").show();
			e.preventDefault();
		}
	})

	let isFloat = function(num) {
		if(num.length == 0){
			return false;
		} else {			
			let nums = num.split('.');
			if(nums.length > 2){
				return false;
			} else {
				let n0 = nums[0];
				if(nums.length == 1){
					if(isNaN(n0)) {
						return false;
					} else {
						return true;
					}
				} else {
					let n1 = nums[1];
					if(isNaN(n0)) {
						return false;
					} else {
						if(n1 && isNaN(n1)) {
							return false;
						} else {
							return true;
						}
					}
					
				}
				
			}
		}
	}


} );