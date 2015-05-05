function initMap(){
	AppVars.map = L.map( "map", { 
		zoomControl: false, 
		attributionControl: false,
		maxZoom: AppVars.maxZoom,
		minZoom: AppVars.minZoom
	} ).setView( [19,95], 6 );

	L.control.fullscreen( {position: 'bottomright' } ).addTo( AppVars.map );
	$( '.leaflet-control-fullscreen a' )
		.append( '<i class="fa fa-expand fa-2x"></i>' )
		.append( '<i class="fa fa-compress fa-2x"></i>' );
	
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
			} else {
				options = {
					html: '<div></div>'
				};
			}

			options.className = 'marker-cluster';
			options.iconSize = [size, size];

			if ( AppVars.selectedPoint ){
				var children = cluster.getAllChildMarkers();
				for ( var i in children ){
					if ( children[i].pointer == AppVars.selectedPoint ){
						options.className += ' activeCluster';
					}
				};
			}
			
			return L.divIcon( options );
		}
	});
	
	AppVars.points.on( 'click', function( e ) {
		AppVars.selectedPoint = e.layer.pointer;
		
		$( '.activeCluster' ).removeClass( 'activeCluster' );
		$( e.layer._icon ).addClass( 'activeCluster' );
		
		selectYear( e.layer.year );
		$( '#entry' + e.layer.pointer + ' .entry-title' ).click();
	});
	
	AppVars.points.on( 'animationend spiderfied', function(){
		if( AppVars.selectedPoint ){
			var point = findPoint( AppVars.selectedPoint );
			if( AppVars.points.getVisibleParent( point ) !== null ){
				$( AppVars.points.getVisibleParent( point )._icon ).addClass( 'activeCluster' )
					.children( 'div' ).css( 'background', 'url( "http://cdm15963.contentdm.oclc.org/utils/getthumbnail/collection/' + AppVars.collectionAlias + '/id/' + AppVars.selectedPoint + '" ) center/80px 60px no-repeat');
			}
		}
	});
	
	AppVars.map.addLayer( AppVars.points );
}

function drawPoints(){
	if( AppVars.points )	AppVars.points.clearLayers();
	_.each( DataVars.filteredData.entries, function( v, k, l ){
		if( v.location.lat !== null){
			var year = v.date.year ? (v.date.year + " | ") : "";
			var marker = L.marker( [ v.location.lat, v.location.lng ],
				{
					title: year + v.title
				});
			marker.year = v.date.year;
			marker.pointer = v.pointer;
			marker.addTo( AppVars.points );
		}
	});
}

function selectPoint( id, zoom ){
	if( AppVars.points ){
		AppVars.selectedPoint = id;
		$( '.activeCluster' ).removeClass( 'activeCluster' ).children( 'div' ).css( 'background', 'initial' );
		
		var point = findPoint( AppVars.selectedPoint );
		if( AppVars.points.getVisibleParent( point ) !== null ){
			var that = $( AppVars.points.getVisibleParent( point )._icon );
			that.addClass( 'activeCluster' );
			that.children( 'div' ).css( 'background', 'url( "http://cdm15963.contentdm.oclc.org/utils/getthumbnail/collection/' + AppVars.collectionAlias + '/id/' + id + '" ) center/80px 60px no-repeat');
		}
	}
}

function findPoint( point ){
	var found;
	AppVars.points.eachLayer( function( e ){
		if( e.pointer  == point){
			found = e;
		}
	});
	return found;
}