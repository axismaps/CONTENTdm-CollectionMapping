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
			if( cluster.getChildCount() >= 5 ){
				var size = 30;
				
				return L.divIcon({
					className: 'marker-cluster',
					iconSize: [size, size],
					html: '<div><span style="line-height: ' + size + 'px">' + cluster.getChildCount() + '</span></div>'
				});
			} else {
					var size = 10;
				return L.divIcon({
					className: 'marker-cluster',
					iconSize: [size, size]
				});
			}
		}
	});
	AppVars.map.addLayer( AppVars.points );
	
	drawPoints();
}

function drawPoints(){	
	_.each( DataVars.filteredData.entries, function( v, k, l ){
		if( v.covera == "" ) return;
		
		if( v.covera.indexOf( ';' ) > -1 ){
			coveraArray = v.covera.split( ";" );
			_.each( coveraArray, function( w ){
				geocode( w );
			});
		} else {
			geocode( v.covera );
		}
		
		function geocode( location ){
			MQ.geocode().search( location )
				.on( 'success', function( e ){
					
					if( e.result.matches.length === 0 ){
						console.log( 'Couldn\'t find: ' + e.result.search );
					} else {
						var result;
						
						$.map( e.result.matches.reverse(), function( v, i ){
							if( AppVars.mapBounds.bounds.contains( v.latlng ) ) {
								result = v;
								return;
							}
						});
						
						if( result ) {
							var latlng = result.latlng;
							
							L.marker( [ latlng.lat, latlng.lng ] )
								.addTo( AppVars.points );
						
						} else {
							console.log( 'Location is off the map: ' + e.result.search );
						}
					}
				});
		}
	});
}