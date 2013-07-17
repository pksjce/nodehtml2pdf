$(function(){
	$('#container').click(function(event){
		$.ajax('/print', {
			data:'{"param":"my new print param"}',
			contentType: "application/json",
			type:"POST",
		})
	})
})