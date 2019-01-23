$( function() {
	$(".datepicker").datepicker();

	$("#iptOrder").blur(function(e) {
		let str = $(this).val();
		// 突然想自己写个逻辑，就没有用正则
		if(str && str.length > 0) {
			$("#optOrder").hide()
		} else {
			$("#optOrder").show()
			$("#iptOrder").focus()
		}
	})

	$("#iptBrand").blur(function(e) {
		let str = $(this).val();
		// 突然想自己写个逻辑，就没有用正则
		if(str && str.length > 0) {
			$("#optBrand").hide()
		} else {
			$("#optBrand").show()
		}
	})

	$("#iptPrice").blur(function(e) {
		let price = $(this).val();
		// 突然想自己写个逻辑，就没有用正则
		if(isFloat(price)) {
			$("#optPrice").hide()
		} else {
			$("#optPrice").show()
		}
	})

	$("#iptAc").blur(function(e) {
		let ac = $(this).val();
		// 突然想自己写个逻辑，就没有用正则
		if(isFloat(ac)) {
			$("#optAc").hide()
		} else {
			$("#optAc").show()
		}
	})


	let isFloat = function(num) {
		if(num.length == 0){
			return false
		} else {			
			var nums = num.split('.')
			if(nums.length > 2){
				return false
			} else {
				var n0 = nums[0]
				if(nums.length == 1){
					if(isNaN(n0)) {
						return false
					} else {
						return true
					}
				} else {
					var n1 = nums[1]
					if(isNaN(n0)) {
						return false
					} else {
						if(n1 && isNaN(n1)) {
							return false
						} else {
							return true
						}
					}
					
				}
				
			}
		}
	}
} );