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
		
		allDocs();
	});
	
	$( '#reports-button' ).on( 'click', function(){
		$( this ).addClass( 'selected' );
		$( '#all-docs-button' ).removeClass( 'selected' );
		
		$( '#secondary-buttons div' ).hide();
		$( '#summary-button' ).show();
		
		if( $( this ).hasClass( 'selected' ) && $( '#bar-expanded' ).is(':visible') && $( '#secondary-buttons').children( '.selected' ).length == 0 ){
			$( '#bar-expanded' ).hide();
		} 
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
	$( '.clear-text' ).click();
}

function initReports(){
	$( '#reports-expanded' ).show();
	if ( $( "#reports-accordion" ).length ) return;
	
	$( '<div/>', {
		id: "reports-accordion"
	}).appendTo( '#reports-expanded .expanded-section' );
	
	$.map( DataVars.data.entries, function( v ) {
		var $title = $( '<h3><i class="fa fa-folder"></i> <span>' + v.title + '</span></h3>' ).appendTo( '#reports-accordion' );
		
		$( '#reports-accordion' ).append( '<div/>' );
		
		if( v.filetype == "jpg" ) {
			var url = 'php/loadImage.php?id=' + v.pointer + '&size=small';
			var width = $( '#reports-accordion' ).width();
			
			$( '<div/>', {
				'class' : 'accordion-image'
			}).appendTo( '#reports-accordion > div:last-child' ).css({
				'background-image':  'url(' + url + ')',
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

			$title.css( 'background-image', 'url(' + url + ')' )
				.prepend( '<div class="mask">' );
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
		heightStyle: "content",
		icons: false
	});
}

function initFilters(){
	$( '#filters-expanded' ).show();
	
	if ( $('#filters-expanded .expanded-section').children().length ) return;
	$( '.expanded-section' ).empty();
	
	//Date Slider
	$( '#date-range' ).append( '<div class="line"><span class="h4-title">Date Range</span><span class="clear-text">Clear</span></div>' );
	
	$( '#date-range .clear-text' ).on( 'click', function(){
		$( '#date-slider' ).slider( "values", [1800, 1900] );
		$( '#minYear' ).text( $( '#date-slider' ).slider( 'values', 0 ) );
		$( '#maxYear' ).text( $( '#date-slider' ).slider( 'values', 1 ) );
		
		DataVars.filters.minYear = $( '#date-slider' ).slider( 'values', 0 );
		DataVars.filters.maxYear = $( '#date-slider' ).slider( 'values', 1 );
		filter();
	});
	
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
		},
		stop: function( event, ui ){
			DataVars.filters.minYear = ui.values[ 0 ];
			DataVars.filters.maxYear = ui.values[ 1 ];
			filter();
		}
	});
	$( '#minYear' ).text( $( '#date-slider' ).slider( 'values', 0 ) );
	$( '#maxYear' ).text( $( '#date-slider' ).slider( 'values', 1 ) );
	
	//Formats
	$( '#format' ).append( '<div class="line"><span class="h4-title">Format</span><span class="clear-text">Clear</span></div>' );
	
	$( '#format .clear-text' ).on( 'click', function() {
		$( '#format p.selected' ).removeClass( 'selected' ).children( 'i' ).remove();
		DataVars.filters.format = [];
		filter();
	});
	
	
	$.map( DataVars.data.formats.sort(), function( v ){
		$('<p/>' , {
			text: v
		})
		.appendTo( $( '#format' ) )
		.on( 'click', function() {
			var text = $( this ).text();
			$( this ).empty().text( text );
			
			if( $( this ).hasClass( 'selected' ) ){
				$( this ).removeClass( 'selected' );
				DataVars.filters.format = _.without( DataVars.filters.format, $( this ).text() );
				filter();
			} else {
				$( this ).append( "<i class='fa fa-check'></i>" );
				$( this ).addClass( 'selected' );
				DataVars.filters.format.push( $( this ).text() );
				filter();
			}
		});
	});
}

function initTags(){
	$( '#tags-expanded' ).show();
	
	var sect = $( '#tags-expanded .expanded-section' );
	if ( sect.children().length ) return;
	sect.empty();
	
	sect.append( '<div class="line"><span class="h4-title">Tags</span><span class="clear-text">Clear</span></div>' );
	
	$( '#tags-expanded .expanded-section .clear-text' ).on( 'click', function() {
		$( '#tags-expanded .expanded-section p.selected' ).removeClass( 'selected' ).children( 'i' ).remove();
		DataVars.filters.tags = [];
		filter();
	});
	
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
				DataVars.filters.tags = _.without( DataVars.filters.tags, $( this ).text() );
				filter();
			} else {
				$( this ).append( "<i class='fa fa-check'></i>" );
				$( this ).addClass( 'selected' );
				DataVars.filters.tags.push( $( this ).text() );
				filter();
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