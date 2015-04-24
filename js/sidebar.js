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
		
		if( $( this ).hasClass( 'selected' ) && $( '#bar-expanded' ).is(':visible') && $( '#secondary-buttons').find( '.selected' ).length == 0 ) $( '#bar-expanded' ).hide();
		
		if( $( '#secondary-buttons').find( '.selected' ).length > 0 ) {
			$( '#secondary-buttons').find( '.selected' ).removeClass( 'selected' );
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
		$( this ).siblings( '.selected' ).removeClass( 'selected' );
		$( this ).addClass( 'selected' );
		
		$( '#bar-expanded > div' ).hide();
		$( '#bar-expanded' ).show();
		initFilters();
	});
	
	$( '#tags-button' ).on( 'click', function(){
		$( this ).siblings( '.selected' ).removeClass( 'selected' );
		$( this ).addClass( 'selected' );
		
		$( '#bar-expanded > div' ).hide();
		$( '#bar-expanded' ).show();
		initTags();
	});
	
	$( '#summary-button' ).on( 'click', function(){
		$( this ).siblings( '.selected' ).removeClass( 'selected' );
		$( this ).addClass( 'selected' );
		
		$( '#bar-expanded > div' ).hide();
		$( '#bar-expanded' ).show();
		initSummary();
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
	
}

function initTags(){
	
}

function initSummary(){
	
}

function initAbout(){
	alert( 'About lightbox will show up here' );
}