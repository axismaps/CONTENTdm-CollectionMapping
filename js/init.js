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
		selectedYearIndex: undefined,
		scrollTimeout: 1,
		timelineRecenterFlag: false,
		selectedPoint: undefined
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
	initSearch();
	initSidebar();
	initTags();
	drawTimeline();
	initMap();
	drawPoints();
}

function initEvents(){
	sidebarEvents();

	$( "#timeline-next" ).click( advanceTimeline );
	$( "#timeline-prev" ).click( rewindTimeline );
	$( "#timeline-inner" ).on( "scroll", timelineScroll );

	$( window ).resize( resize );

	resize();
}

function resize(){
	$( "#timeline-inner" ).height( $( "#timeline" ).height() - $( "#year" ).outerHeight() );
	recenterTimeline();
	drawPulse();
}

function update(){
	drawPoints();
	drawTimeline();
	drawPulse();
}

function loadData(){
	$.get( "csv/reports.csv", function( csv ){
		DataVars.reports = Papa.parse( csv, {header: true} ).data;
	});
	
	$.get( "php/loadData.php", {
		collection: AppVars.collectionAlias
	}).done( function( data ) {
		DataVars.data = $.parseJSON( data );
		DataVars.filteredData = $.parseJSON( data );
		DataVars.filters.minYear = DataVars.data.minYear;
		DataVars.filters.maxYear = DataVars.data.maxYear;
		console.log( DataVars );
		init();
	});
}