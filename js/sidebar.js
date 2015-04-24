function initSidebar(){
	$( '#filters-button' ).show();
	$( '#tags-button' ).show();
	$( '#summary-button' ).hide();
}

function sidebarEvents() {
	$( '#all-docs-button' ).on( 'click', function(){
		if( $( this ).hasClass( 'selected' ) && $( '#bar-expanded' ).is(':visible') ) $( '#bar-expanded' ).hide();
		else {
			$( '#bar-expanded' ).show();
			//initAllDocs();
			$( '#bar-expanded' ).text( 'Initialize All Docs' );
		}
		
		$( this ).addClass( 'selected' );
		$( '#reports-button' ).removeClass( 'selected' );
		
		$( '#secondary-buttons div' ).hide();
		$( '#filters-button' ).show();
		$( '#tags-button' ).show();
	});
	
	$( '#reports-button' ).on( 'click', function(){
		if( $( this ).hasClass( 'selected' ) && $( '#bar-expanded' ).is(':visible') ) $( '#bar-expanded' ).hide();
		else {
			$( '#bar-expanded' ).show();
			//initReports();
			$( '#bar-expanded' ).text( 'Initialize Reports' );
		}
		
		$( this ).addClass( 'selected' );
		$( '#all-docs-button' ).removeClass( 'selected' );
		
		$( '#secondary-buttons div' ).hide();
		$( '#summary-button' ).show();
	});
	
	$( '#filters-button' ).on( 'click', function(){
		$( '#bar-expanded' ).show();
		$( '#bar-expanded' ).text( 'Initialize Filters' );
		//initFilters();
	});
	
	$( '#tags-button' ).on( 'click', function(){
		//initTags();
		$( '#bar-expanded' ).show();
		$( '#bar-expanded' ).text( 'Initialize Tags' );
	});
	
	$( '#summary-button' ).on( 'click', function(){
		//initSummary();
		$( '#bar-expanded' ).show();
		$( '#bar-expanded' ).text( 'Initialize Summary' );
	});
	
	$( '#about-button' ).on( 'click', function(){
		//initAbout();
		$( '#bar-expanded' ).show();
		$( '#bar-expanded' ).text( 'Initialize About' );
	});
}