$( function() {
	let acYear0 = $("#acYear0").val();
	console.log(acYear0)
	let acDesp = 'ACCONTO PER MOBILI DA CONSEGNARE';
	let iAttrib = 0
	let newGoods = function() {
		let j=iAttrib-1
		str = '<div class="form-group row attrib attrib' + iAttrib +'" id="attrib' + iAttrib +'">'
			str += '<label class="col-lg-2 col-form-label"> goods ' + iAttrib +' </label>'
			str += '<div class="col-lg-2">'
				str += '<input class="form-control" type="text", name="goods['+j+'][code]", value='+iAttrib+' placeholder="Goods No."/>'
			str += '</div>'
			str += '<div class="col-lg-2">'
				str += '<input class="form-control" type="text", name="goods['+j+'][hs]", placeholder="HS Code"/>'
			str += '</div>'
			str += '<div class="col-lg-3">'
				str += '<input class="form-control" type="text", name="goods['+j+'][brand]", placeholder="Brand Name"/>'
			str += '</div>'
			str += '<div class="col-lg-3">'
				str += '<input class="form-control" type="text", name="goods['+j+'][order]", placeholder="Order"/>'
			str += '</div>'
			str += '<label class="col-lg-2"></label>'
			str += '<h4 class="col-lg-2 text-right my-2">Quotaty:</h4>'
			str += '<div class="col-lg-2">'
				str += '<input class="form-control my-2 quot", id="quot-'+j+'", type="number", name="goods['+j+'][quot]", value=1 placeholder="Qty."/>'
			str += '</div>'
			str += '<h4 class="col-lg-1 my-2 text-right">Price:</h4>'
			str += '<div class="col-lg-2">'
				str += '<input class="form-control my-2 price", id="price-'+j+'", type="text", name="goods['+j+'][price]", value=0 placeholder="Price"/>'
			str += '</div>'
			str += '<div class="col-lg-1 my-2 text-right pt-1">'
				str += '<h4> Tot: </h4>'
			str += '</div>'
			str += '<div class="col-lg-2 my-2 text-right pt-1">'
				str += '<h4><span class="text-warning tot" id="tot-'+j+'">0</span></h4>'
			str += '</div>'

			str += '<label class="col-lg-2"></label>'
			str += '<div class="col-lg-10">'
				str += '<textarea class="form-control" rows=5, name="goods['+j+'][desp]", placeholder="Description"/>'
			str += '</div>'
		str += '</div>'
		$('.attrib'+j).after(str)
	}
	let countPrice = function(ident) {
		let price = $("#price-"+ident).val();
		let quot = $("#quot-"+ident).val();
		let tot = price * quot;
		$("#tot-"+ident).text(String(tot))
		let total = 0;
		for(let i=0; i<=ident; i++) {
			price = $("#price-"+i).val();
			quot = $("#quot-"+i).val();
			tot = price * quot;
			total += tot;
		}
		$("#total").val(total);
	}
	$("#addFattura").on('blur', '.price', function(e) {
		let ident = $(this).attr('id').split('-')[1]
		countPrice(ident);
	})
	$("#addFattura").on('blur', '.quot', function(e) {
		let ident = $(this).attr('id').split('-')[1]
		countPrice(ident);
	})
	let newAC = function() {
		str = '<div class="form-group row acFattura">'
			str += '<label class="col-lg-2 col-form-label"> AC </label>'
			str += '<input type="hidden", name="goods[0][code]", value="1 &nbsp; &nbsp; ANT."/>'
			str += '<div class="col-lg-3">'
				str += '<input class="form-control" type="text", name="goods[0][price]", value=0 placeholder="Price"/>'
			str += '</div>'

			str += '<div class="col-lg-6">'
				str += '<input class="form-control" name="goods[0][desp]", value="'+acDesp+'" placeholder="Description"/>'
			str += '</div>'
		str += '</div>'
		$('.attrib'+0).after(str)
	}
	newAC();
	$('#iptTaxType').change(function(e) {
		iAttrib = 1;
		$('.attrib').remove();
		$('.acFattura').remove();

		iAc = 0;
		$('.addAcs').remove();
		if($(this).val() != 0) {
			newGoods();
			$('.notAC').show()
		} else {
			newAC();
			$('.notAC').hide()
		}
	})

	$('#addAttrib').click(function(e) {
		iAttrib += 1
		newGoods();
	})

	$('#delAttrib').click(function(e) {
		if(iAttrib > 1) {
			countPrice(0);
			$("#attrib"+iAttrib).remove()
			iAttrib -= 1
		}
	})

	let iAc = 0
	$('#addAc').click(function(e) {
		iAc += 1
		let j=iAc-1
		str = '<div class="form-group row addAcs ac' + iAc +'" id="ac' + iAc +'">'
			str += '<label class="col-lg-2 col-form-label"> AC Fattura ' + iAc +' </label>'
			str += '<div class="col-lg-1">'
				str += '<input class="form-control", id="acYear-'+iAc+'", type="number", value='+acYear0+' placeholder="年份2位"/>'
			str += '</div>'
			str += '<h5 class="col-lg-1 text-right pt-2">Code:</h5>'
			str += '<div class="col-lg-2">'
				str += '<input class="form-control acCode", id="acCode-'+iAc+'", type="number", placeholder="Order"/>'
			str += '</div>'
			str += '<h5 class="col-lg-3 text-center pt-2">Price: <span id="acRmdt-'+iAc+'" ></span> / <span id="acTotalt-'+iAc+'" ></span></h5>'
			str += '<div class="col-lg-3">';
				str += '<input class="form-control" id="acPay-'+iAc+'" type="text" name="facs['+j+'][pay]" placeholder="Pay"/>'
			str += '</div>'
				str += '<input id="acFid-'+iAc+'" type="hidden" name="facs['+j+'][ac]" readonly="readonly">'
				str += '<input id="acTotal-'+iAc+'" type="hidden" readonly="readonly">'
				str += '<input id="acRmd-'+iAc+'" type="hidden" readonly="readonly">'
		str += '</div>'
		$('.ac'+j).after(str)
	})
	$("#addFattura").on('blur', '.acCode', function(e) {
		let ident = $(this).attr('id').split('-')[1]
		let year = $("#acYear-"+ident).val();
		let code = $(this).val();
		$.ajax({
			type: 'GET',
			url: '/fnAjaxCodeFattura?code=' + code + '&year='+year
		})
		.done(function(results) {
			if(results.success === 1) {
				let fattura = results.fattura;
				$("#acFid-"+ident).val(fattura._id)
				$("#acTotal-"+ident).val(fattura.total)
				$("#acRmd-"+ident).val(fattura.rmd)
				$("#acTotalt-"+ident).text(fattura.total)
				$("#acRmdt-"+ident).text(fattura.rmd)
				let paid = 0;
				console.log(iAc)
				for(let i=0; i<iAc; i++) {
					ident = i+1
					acRmd = parseFloat($("#acRmd-"+ident).val());
					if(!isNaN(acRmd)) {
						paid += acRmd;
					}
				}
				$("#paid").val(paid);
				let acpay = parseFloat(fattura.rmd);
				if(paid>parseFloat($("#total").val())){
					acpay = parseFloat(fattura.rmd) - (paid - parseFloat($("#total").val()) );
				}
				$("#acPay-"+ident).val(acpay);
			} else if(results.success === 0) {
				console.log(results.info)
			}
		})
	})
	$('#delAc').click(function(e) {
		$("#ac"+iAc).remove()
		iAc -= 1
	})
} );