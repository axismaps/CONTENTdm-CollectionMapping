function initSidebar(){
	$( '#filters-button' ).show();
	$( '#tags-button' ).show();
	$( '#summary-button' ).hide();
}

function sidebarEvents() {
	$( '#all-docs-button' ).on( 'click', function(){
		$( '#bar-expanded' ).hide();
				
		$( this ).addClass( 'selected' );
		$( '#reports-button' ).removeClass( 'selected' );
		$( '#secondary-buttons').find( '.selected' ).removeClass( 'selected' );
		$( '#secondary-buttons div' ).hide();
		$( '#filters-button' ).show();
		$( '#tags-button' ).show();
		
		initAllDocs();
	});
	
	$( '#reports-button' ).on( 'click', function(){
		$( this ).addClass( 'selected' );
		$( '#all-docs-button' ).removeClass( 'selected' );
		
		$( '#secondary-buttons div' ).hide();
		$( '#summary-button' ).show();
		
		if( $( this ).hasClass( 'selected' ) && $( '#bar-expanded' ).is(':visible') && $( '#secondary-buttons').children( '.selected' ).length == 0 ) $( '#bar-expanded' ).hide();
		else if( $( '#secondary-buttons').children( '.selected' ).length > 0 ) {
			$( '#secondary-buttons').children( '.selected' ).removeClass( 'selected' );
			$( '#bar-expanded > div' ).hide();
			initReports();
		}
		else {
			$( '#bar-expanded > div' ).hide();
			$( '#bar-expanded' ).show();
			initReports();
		}
	});
	
	$( '#filters-button' ).on( 'click', function(){
		if( $( this ).hasClass( 'selected' ) ){
			$( '#bar-expanded' ).hide();
			$( this ).removeClass( 'selected' );
		}
		else {
			$( this ).siblings( '.selected' ).removeClass( 'selected' );
			$( this ).addClass( 'selected' );
			
			$( '#bar-expanded > div' ).hide();
			$( '#bar-expanded' ).show();
			initFilters();
		}
	});
	
	$( '#tags-button' ).on( 'click', function(){
		if( $( this ).hasClass( 'selected' ) ){
			$( '#bar-expanded' ).hide();
			$( this ).removeClass( 'selected' );
		}
		else {
			$( this ).siblings( '.selected' ).removeClass( 'selected' );
			$( this ).addClass( 'selected' );
			
			$( '#bar-expanded > div' ).hide();
			$( '#bar-expanded' ).show();
			initTags();
		}
	});
	
	$( '#summary-button' ).on( 'click', function(){
		if( $( this ).hasClass( 'selected' ) ){
			$( '#bar-expanded' ).hide();
			$( this ).removeClass( 'selected' );
		}
		else {
			$( this ).siblings( '.selected' ).removeClass( 'selected' );
			$( this ).addClass( 'selected' );
			
			$( '#bar-expanded > div' ).hide();
			$( '#bar-expanded' ).show();
			initSummary();
		}
	});
	
	$( '#about-button' ).on( 'click', function(){
		initAbout();
	});
}

function allDocs(){
	
}

function initReports(){
	$( '#reports-expanded' ).show();
	
	$( '<div/>', {
		id: "reports-accordion"
	}).appendTo( '#reports-expanded .expanded-section' );
	
	$.map( DataVars.data.entries, function( v ) {
		$( '#reports-accordion' ).append( '<h3><i class="fa fa-folder"></i> ' + v.title + '</h3>' );
		
		$( '#reports-accordion' ).append( '<div/>' );
		
		if( v.filetype == "jpg" ) {
			var url = 'http://cdm15963.contentdm.oclc.org/utils/ajaxhelper/?CISOROOT=' + AppVars.collectionAlias + '&CISOPTR=' + v.pointer + '&action=2&DMSCALE=20&DMWIDTH=1000&DMHEIGHT=800';
			var width = $( '#reports-accordion' ).width();
			
			$( '<div/>', {
				'class' : 'accordion-image'
			}).appendTo( '#reports-accordion > div:last-child' ).css({
				background:  'url(' + url + ')' + 'no-repeat 50% top',
				width: width + 'px',
				height: width + 'px'
			});
			
			$( '<div/>' )
				.appendTo( '#reports-accordion > div:last-child > div' )
				.html( '<i class="fa fa-expand fa-2x"></i>' )
				.on( 'click', function(){
					//TODO: Show lightbox of report summary
					console.log( 'Show lightbox here' );
			});
		}
		
		$( '<p/>' ).appendTo( '#reports-accordion > div:last-child' ).text( v.descri ).succinct({
			size: 300
		});
		
		$( '<div/>', {
				'class': 'button',
				html : 'View Report <i class="fa fa-chevron-right"></i>'
		}).appendTo( '#reports-accordion > div:last-child' )
		.on( 'click', function(){
			//TODO: Show full report on click
			console.log( v );
		});
	});
	
	$( '#reports-accordion' ).accordion({
		heightStyle: "content"
	});
}

function initFilters(){
	$( '#filters-expanded' ).show();
	
	$( '.expanded-section' ).empty();
	
	//Date Slider
	$( '#date-range' ).append( '<h3>Date Range</h3>' );
	$( '#date-range' ).append( 
		'<span id="minYear"></span>', 
		'<div id="date-slider"></div>',
		'<span id="maxYear"></span>'
	);
	$( '#date-slider' ).slider({
		range: true,
		min: DataVars.data.minYear,
		max: DataVars.data.maxYear,
		values: [ 1800, 1900 ], //TODO: Should this be dynamically set?
		slide: function( event, ui ){
			$( '#minYear' ).text( ui.values[ 0 ] );
			$( '#maxYear' ).text( ui.values[ 1 ] );
		}
	});
	$( '#minYear' ).text( $( '#date-slider' ).slider( 'values', 0 ) );
	$( '#maxYear' ).text( $( '#date-slider' ).slider( 'values', 1 ) );
	
	//Formats
	$( '#format' ).append( '<h3>Format</h3>' );
	$.map( DataVars.data.formats, function( v ){
		$('<p/>' , {
			text: v
		})
		.appendTo( $( '#format' ) )
		.on( 'click', function() {
			var text = $( this ).text();
			$( this ).empty().text( text );
			
			if( $( this ).hasClass( 'selected' ) ){
				$( this ).removeClass( 'selected' );
			} else {
				$( this ).append( "<i class='fa fa-check'></i>" );
				$( this ).addClass( 'selected' );
			}
		});
	});
}

function initTags(){
	$( '#tags-expanded' ).show();
	
	var sect = $( '#tags-expanded .expanded-section' );
	sect.empty();
	
	sect.append( '<h3>Tags</h3>' );
	$.map( DataVars.data.tags, function( v ){
		$('<p/>' , {
			text: v
		})
		.appendTo( sect )
		.on( 'click', function() {
			var text = $( this ).text();
			$( this ).empty().text( text );
			
			if( $( this ).hasClass( 'selected' ) ){
				$( this ).removeClass( 'selected' );
			} else {
				$( this ).append( "<i class='fa fa-check'></i>" );
				$( this ).addClass( 'selected' );
			}
		});
	});
}

function initSummary(){
	$( '#summary-expanded' ).show();
}

function initAbout(){
	alert( 'About lightbox will show up here' );
}