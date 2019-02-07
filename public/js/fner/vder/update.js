$( function() {
	$("#updateInfo").submit(function(e) {
		if(!isFloat($("#iptSa").val())) {
			$("#optTaxFree").show();
			e.preventDefault();
		}
	})


	$("#iptTaxFree").blur(function(e) {
		let taxFree = $(this).val();
		// 突然想自己写个逻辑，就没有用正则
		if(isFloat(taxFree)) {
			$("#optTaxFree").hide();
		} else {
			$("#optTaxFree").show();
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