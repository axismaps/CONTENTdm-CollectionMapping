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

function initAllDocs(){
	
}

function initReports(){
	$( '#reports-expanded' ).show();
}

function initFilters(){
	$( '#filters-expanded' ).show();
	
	$( '.expanded-section' ).empty();
	
	$( '#date-range' ).append( '<h3>Date Range</h3>' );
	$( '#date-range' ).append( 
		'<span>' + DataVars.data.minYear + '</span>', 
		'<span>' + " SLIDER GOES HERE " + '</span>',
		'<span>' + DataVars.data.maxYear + '</span>'
	);
	
	$( '#format' ).append( '<h3>Format</h3>' );
	$.map( DataVars.data.formats, function( v ){
		$( '#format' ).append( '<p>' + v + '</p>' );
	});
}

function initTags(){
	$( '#tags-expanded' ).show();
	
	var sect = $( '#tags-expanded .expanded-section' );
	sect.empty();
	sect.append( '<h3>Tags</h3>' );
	$.map( DataVars.data.tags, function( v ){
		sect.append( '<p>' + v + '</p>' );
	});
}

function initSummary(){
	$( '#summary-expanded' ).show();
}

function initAbout(){
	alert( 'About lightbox will show up here' );
}