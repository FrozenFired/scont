$(function() {

	assignBcateg();

	$('#iptCode').blur(function() {
		let brandCode = $(this).val()
		brandCode = brandCode.replace(/(\s*$)/g, "").replace( /^\s*/, '')
		if(brandCode.length > 0){
			let code = encodeURIComponent(brandCode)
			$.ajax({
				type: 'get',
				url: '/ajaxCodeBrand?keytype=code&keyword=' + code
			})
			.done(function(results) {
				let thisCode = $("#orgCode").val();
				if(results.success === 1 && results.brand.code != thisCode) {
					$("#optCode").text("已有此品牌");
					$("#sub").hide();
					$("#back").show();
				} else {
					$("#optCode").text("");
					$("#sub").show();
					$("#back").hide();
				}
			})
		} else {
			$("#optCode").text("请输入品牌名称");
		}
	})

	$('#iptCateFir').change(function() {
		$('.opn').remove()				// 先移除table下的其他信息
		let bcate = $(this).val()
		if(bcate > -1){
			$.ajax({
				type: 'get',
				url: '/ajaxBcateg?keytype=bcate&keyword=' + bcate
			})
			.done(function(results) {
				if(results.success === 1) {
					let bcategs = results.bcategs
					for(i = 0; i <bcategs.length; i++){			// 把数据添加上去
						let option = '<option class="opn" value='+bcategs[i]._id+"> "+bcategs[i].code+" </option>"
						$("#iptCateg").append(option)
					}
				} else {
					alert(results.info)
				}
			})
		} else {
			$("#optCateg").text("Please Select Category");
		}
	})

	$('#iptCateg').change(function() {
		if($(this).val().length > 10){
			$("#optCateg").text("");
		} else {
			$("#optCateg").text("Please Select Category");
		}
	})

	$("#update").submit(function(e) {
		if($("#iptCode").val().length < 1) {
			$("#optCode").text("请输入品牌名称");
			e.preventDefault();
		}
		else if(($("#iptCateg").val() && $("#iptCateg").val().length < 10) || !$("#iptCateg").val()) {
			$("#optCateg").text("Please Select Category");
			e.preventDefault();
		}
	})

	function assignBcateg() {
		$('.opn').remove()				// 先移除table下的其他信息
		let bcate = $("#orgBcate").val()
		if(bcate > -1){
			$.ajax({
				type: 'get',
				url: '/ajaxBcateg?keytype=bcate&keyword=' + bcate
			})
			.done(function(results) {
				if(results.success === 1) {
					let bcategs = results.bcategs
					let bcategId = $("#orgBcateg").val();
					for(i = 0; i <bcategs.length; i++){			// 把数据添加上去
						let option
						if(String(bcategs[i]._id) == String(bcategId)) {
							option = '<option class="opn" value='+bcategs[i]._id+' selected="selected"> '+bcategs[i].code+" </option>"
						} else {
							option = '<option class="opn" value='+bcategs[i]._id+"> "+bcategs[i].code+" </option>"
						}
						$("#iptCateg").append(option)
					}
				} else {
					alert(results.info)
				}
			})
		} else {
			$("#optCateg").text("Please Select Category");
		}
	}
})