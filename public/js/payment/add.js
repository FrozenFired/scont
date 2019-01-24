$( function() {
	$(".datepicker").datepicker();

	$("#iptOrder").focus();

	let now = new Date();
	let month = String(now.getMonth()+1);
	if(month.length==1) month= '0'+month;
	let today = parseInt(now.getFullYear()+month+now.getDate())

	$("#addPayment").submit(function(e) {
		let acAt = $("#iptAcAt").val();
		let dates = acAt.split('/')
		let acTime = parseInt(dates[2]+dates[0]+dates[1]);

		if($("#iptOrder").val().length < 1) {
			$("#optOrder").show();
			e.preventDefault();
		}
		else if($("#iptPi").val().length < 1) {
			$("#optPi").show();
			e.preventDefault();
		}
		else if($("#iptBrand").val().length < 1) {
			$("#optBrand").show();
			e.preventDefault();
		}
		else if($("#iptBrand").val().length < 1) {
			$("#optBrand").show();
			e.preventDefault();
		}
		else if(!isFloat($("#iptPrice").val())) {
			$("#optPrice").show();
			e.preventDefault();
		}
		else if(!isFloat($("#iptAc").val())) {
			$("#optAc").show();
			e.preventDefault();
		}
		else if(isNaN(acTime)) {
			$("#optAcAt").text("日期不能小于今天");
			e.preventDefault();
		} else if(acTime < today) {
			$("#optAcAt").text("acAt Wrong");
			e.preventDefault();
		}
		else if(!isFloat($("#iptSa").val())) {
			$("#optSa").show();
			e.preventDefault();
		}
	})

	$("#iptOrder").blur(function(e) {
		let str = $(this).val();
		if(str && str.length > 0) {
			$("#optOrder").hide();
		} else {
			$("#optOrder").show();
		}
	})

	$("#iptPi").blur(function(e) {
		let str = $(this).val();
		if(str && str.length > 0) {
			$("#optPi").hide();
		} else {
			$("#optPi").show();
		}
	})

	$("#iptBrand").blur(function(e) {
		let str = $(this).val();
		if(str && str.length > 0) {
			$("#optBrand").hide();
		} else {
			$("#optBrand").show();
		}
	})

	$("#iptPrice").blur(function(e) {
		let price = $(this).val();
		// 突然想自己写个逻辑，就没有用正则
		if(isFloat(price)) {
			$("#optPrice").hide();
		} else {
			$("#optPrice").show();
		}
	})

	$("#iptAc").blur(function(e) {
		let ac = $(this).val();
		// 突然想自己写个逻辑，就没有用正则
		if(isFloat(ac)) {
			$("#optAc").hide();
		} else {
			$("#optAc").show();
		}
	})

	$("#iptAcAt").change(function(e) {
		let acAt = $("#iptAcAt").val();
		let dates = acAt.split('/')
		let acTime = parseInt(dates[2]+dates[0]+dates[1]);

		if(isNaN(acTime)) {
			$("#optAcAt").text("日期不能小于今天");
		} else if(acTime < today) {
			$("#optAcAt").text("acAt Wrong");
		} else {
			$("#optAcAt").text("");
		}
	})

	$("#iptSa").blur(function(e) {
		let sa = $(this).val();
		// 突然想自己写个逻辑，就没有用正则
		if(isFloat(sa)) {
			$("#optSa").hide();
		} else {
			$("#optSa").show();
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