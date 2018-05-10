
$(function() {
	$('#bomba').change(function() {
		alert("test");
	})
})

$(function() {
	$('#valvula1').change(function() {
		alert("test");
	})
})

$(function() {
	$('#valvula2').change(function() {
		alert("test");
	})
})


$(function() {
	$('#valvula3').change(function() {
		alert("test valvula 3");
	})
})


$(function() {
	$('#manual').change(function() {
		alert($('#manual').is(':checked'));
		if($('#manual').is(':checked')){
			$('#bomba').bootstrapToggle('disable');
			$('#valvula1').bootstrapToggle('disable');
			$('#valvula2').bootstrapToggle('disable');
			$('#valvula3').bootstrapToggle('disable');
			
		}else{
			$('#bomba').bootstrapToggle('enable');
			$('#valvula1').bootstrapToggle('enable');
			$('#valvula2').bootstrapToggle('enable');
			$('#valvula3').bootstrapToggle('enable');
		}
	})
})


$(function() {
	$('#servidor').change(function() {
		alert("test");
	})
})