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
			
			return L.divIcon(options);
		}
	});
	AppVars.map.addLayer( AppVars.points );
}

function geocodePoints(){
	_.each( DataVars.data.entries, function( v, k, l ){
		if( v.covera == "" ) return;
		
		if( v.covera.indexOf( ';' ) > -1 ){
			coveraArray = v.covera.split( ';' );
			_.each( coveraArray, function( w ){
				geocode( w, v );
			});
		} else {
			geocode( v.covera, v );
		}
	});
		
	function geocode( location, entry ){
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
						entry.location = [ latlng.lat, latlng.lng ];
					} else {
						console.log( 'Location is off the map: ' + e.result.search );
					}
				}
			});
	}
}

function drawPoints(){
	AppVars.points.clearLayers();
	_.each( DataVars.filteredData.entries, function( v, k, l ){
		L.marker( v.location ).addTo( AppVars.points );
	});
}