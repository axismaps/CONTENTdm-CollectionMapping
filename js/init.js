//placeholder until data loading functions are ready
$( document ).ready(function() {
    loadData();
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
	DataVars = {
		filters: {
			minYear: 0,
			maxYear: 9999,
			format: [],
			tags: []
		}
	};

function init() {
	initEvents();
	initSidebar();
	drawTimeline();
	initMap();
}

function initEvents(){
	sidebarEvents();

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
	$.get( "php/loadData.php", {
		collection: AppVars.collectionAlias,
		fields: ['subjec', 'date', 'covera', 'descri', 'format']
	}).done( function( data ) {
		DataVars.data = $.parseJSON( data );
		DataVars.filteredData = $.parseJSON( data );
		console.log( DataVars );
		init();
	});
}