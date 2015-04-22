//placeholder until data loading functions are ready
$( document ).ready(function() {
    init();
});

function init() {
	initEvents();
}

function initEvents(){
	$( '#reports-button' ).on( 'click', function(){
		$( '#bar-expanded' ).toggle();
	});
}