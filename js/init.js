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
		minZoom: 4
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
	loadData();
	initEvents();
	initSidebar();
	initMap();
}

function initEvents(){
	sidebarEvents();
}

function loadData(){
	$.get( "loadData.php", {
		collection: AppVars.collectionAlias,
		fields: ['subjec', 'date', 'covera', 'descri']
	}).done( function( data ) {
		DataVars.data = $.parseJSON( data );
		DataVars.filteredData = $.parseJSON( data );
		console.log( DataVars );
	});
}