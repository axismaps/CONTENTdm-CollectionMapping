//placeholder until data loading functions are ready
$( document ).ready(function() {
    init();
});

/* Globals */
var ServerVars,
	AppVars = {
		map: {},
		mapBounds: {
			north: 27.5,
			south: 15,
			east: 99.5,
			west: 90.5
		},
		maxZoom: 10,
		minZoom: 4
	},
	DataVars;

function init() {
	loadData();
	initEvents();
	initMap();
}

function initEvents(){
	$( '#reports-button' ).on( 'click', function(){
		$( '#bar-expanded' ).toggle();
	});
}

function loadData(){
	$.get( "loadData.php", {
		field: 'value',
		name: 'test name'
	}).done( function( data ) {
		$( '#timeline' ).html( data );
	});
}