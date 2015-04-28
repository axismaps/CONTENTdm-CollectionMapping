function initMap(){
	AppVars.map = L.map( "map", { 
		zoomControl: false, 
		attributionControl: false,
		maxZoom: AppVars.maxZoom,
		minZoom: AppVars.minZoom
	} ).setView( [19,95], 6 );
	
	/*placeholder tiles for now */
	/* TODO: Do we want these? If not, restrict bounds so you can't see anything beyond historicTiles */
	modernTiles = L.tileLayer( "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png" , { maxNativeZoom : 18, maxZoom : 21 }).addTo(AppVars.map);
	
	AppVars.mapBounds.bounds = L.latLngBounds([ 
		[AppVars.mapBounds.south, AppVars.mapBounds.west],
		[AppVars.mapBounds.north, AppVars.mapBounds.east]
	]);
	
	historicTiles = L.tileLayer( "tiles/{z}/{x}/{y}.png", {
		tms : true,
		bounds: AppVars.mapBounds.bounds
	}).addTo(AppVars.map);
	
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
			console.log( location );
			MQ.geocode().search( location )
				.on( 'success', function( e ){
					
					if( e.result.matches.length === 0 ){
						console.log( 'Couldn\'t find one' );
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

							// var geocodeIcon = L.icon({
								// iconUrl: 'img/' + selectedCategory + '-marker.png',
								// iconSize: [62, 82],
								// iconAnchor: [31, 82]
							// });
							
							L.marker( [ latlng.lat, latlng.lng ] )
								.addTo( AppVars.map );
						
						} else {
							console.log( 'Location is off the map' );
						}
					}
				});
		}
	});
}