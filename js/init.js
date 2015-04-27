//placeholder until data loading functions are ready
$( document ).ready(function() {
    init();
});

/* Globals */
var ServerVars = {},
	AppVars = {
		collectionAlias: 'p15963coll18',
		map: {},
		mapBounds: {
			north: 27.5,
			south: 15,
			east: 99.5,
			west: 90.5
		},
		maxZoom: 10,
		minZoom: 4,
		years: undefined,
		selectedYear: undefined,
		selectedYearIndex: undefined
	},
	DataVars = {};

function init() {
	loadData();
	initEvents();
	initMap();
}

function initEvents(){
	$( '#reports-button' ).on( 'click', function(){
		$( '#bar-expanded' ).toggle();
		recenterTimeline();
	});

	$( "#timeline-next" ).click( advanceTimeline );
	$( "#timeline-prev" ).click( rewindTimeline );

	$( window ).resize( resize );

	resize();
}

function resize(){
	$( "#timeline-inner" ).height( $( "#timeline" ).height() - $( "#year" ).outerHeight() );
	recenterTimeline();
}

function loadData(){
	$.get( "loadData.php", {
		collection: AppVars.collectionAlias,
		fields: ['subjec', 'date', 'covera']
	}).done( function( data ) {
		DataVars.data = $.parseJSON( data );
		drawTimeline();
	});
}