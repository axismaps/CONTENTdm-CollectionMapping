function initMap(){
	AppVars.map = L.map( "map", { 
		zoomControl: false, 
		attributionControl: false,
		maxZoom: AppVars.maxZoom,
		minZoom: AppVars.minZoom
	} ).setView( [19,95], 6 );
	
	/*placeholder tiles for now */
	/* TODO: Do we want these? If not, restrict bounds so you can't see anything beyond historicTiles */
	AppVars.modernTiles = L.tileLayer( "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png" , { maxNativeZoom : 18, maxZoom : 21 }).addTo(AppVars.map);
	
	AppVars.mapBounds.bounds = L.latLngBounds([ 
		[AppVars.mapBounds.south, AppVars.mapBounds.west],
		[AppVars.mapBounds.north, AppVars.mapBounds.east]
	]);
	
	AppVars.historicTiles = L.tileLayer( "tiles/{z}/{x}/{y}.png", {
		tms : true,
		bounds: AppVars.mapBounds.bounds
	}).addTo(AppVars.map);
	
	AppVars.points = new L.MarkerClusterGroup({
		showCoverageOnHover: false,
		singleMarkerMode: true,
		iconCreateFunction: function( cluster ){
			var size = 10,
				options = {};
			if( cluster.getChildCount() > 1 && cluster.getChildCount() < 10 ){
				size = 30;
				options = {
					html: '<div><span style="line-height: ' + size + 'px">' + cluster.getChildCount() + '</span></div>'
				};
			} else if( cluster.getChildCount() >= 10 ){
				size = 50;
				options = {
					html: '<div><span style="line-height: ' + size + 'px">' + cluster.getChildCount() + '</span></div>'
				};
			}
				
			options.className = 'marker-cluster';
			options.iconSize = [size, size];
			
			return L.divIcon( options );
		}
	});
	
	AppVars.points.on( 'click', function( e ) {
		$( '.activeMarker' ).removeClass( 'activeMarker' );
		$( e.layer._icon ).addClass( 'activeMarker' );
		selectYear( e.layer.year );
		$( '#entry' + e.layer.pointer + ' .entry-title' ).click();
	});
	
	AppVars.map.addLayer( AppVars.points );
}

function drawPoints(){
	if( AppVars.points )	AppVars.points.clearLayers();
	_.each( DataVars.filteredData.entries, function( v, k, l ){
		if( v.location.lat !== null){
			var marker = L.marker( [ v.location.lat, v.location.lng ] );
			marker.year = v.date.year;
			marker.pointer = v.pointer;
			marker.addTo( AppVars.points );
		}
	});
}

function selectPoint( point ){
	if( AppVars.points ){
		$( '.activeMarker' ).removeClass( 'activeMarker' );
		$( '.activeCluster' ).removeClass( 'activeCluster' );
		
		AppVars.points.eachLayer(function( e ) {
			if( e.pointer  == point ){
				$( this ).addClass( 'activeMarker' );
				$( AppVars.points.getVisibleParent( e )._icon ).addClass( 'activeCluster' );
			}
		});
	}
}