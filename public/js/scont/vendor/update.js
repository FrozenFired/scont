$(function() {
	var i = parseInt($("#contactsLen").val())
	$('#addContact').click(function(e) {
		i += 1
		var j=i-1
		str = '<div class="form-group row contact' + i +'" id="contact' + i +'">'
			str += '<label class="col-md-2 col-form-label"> contact' + i +' </label>'
			str += '<div class="col-md-3">'
				str += '<input class="form-control" type="text", name="object[contacts]['+j+'][contacter]", placeholder="contacter<position>"/>'
			str += '</div>'
			str += '<div class="col-md-3">'
				str += '<input class="form-control" type="text", name="object[contacts]['+j+'][tel]", placeholder="telephone"/>'
			str += '</div>'
			str += '<div class="col-md-4">'
				str += '<input class="form-control" type="text", name="object[contacts]['+j+'][email]", placeholder="email""/>'
			str += '</div>'
		str += '</div>'
		$('.contact'+j).after(str)
	})

	$('#delContact').click(function(e) {
		$("#contact"+i).remove()
		i -= 1
	})

})