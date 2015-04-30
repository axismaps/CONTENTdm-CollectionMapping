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
		$( '#reports-accordion' ).append( '<h3><i class="fa fa-folder"></i> ' + v.title + '</h3>' );
		
		$( '#reports-accordion' ).append( '<div class="reports-accordion-content"/>' );
		
		if( v.filetype == "jpg" ) {
			var url = 'http://cdm15963.contentdm.oclc.org/utils/ajaxhelper/?CISOROOT=' + AppVars.collectionAlias + '&CISOPTR=' + v.pointer + '&action=2&DMSCALE=20&DMWIDTH=1000&DMHEIGHT=800';
			var width = $( '#reports-accordion' ).width();
			
			$( '<div/>', {
				'class' : 'accordion-image image-container'
			}).appendTo( '#reports-accordion > div:last-child' ).css({
				background:  'url(' + url + ')' + 'no-repeat 50% top',
				width: width + 'px',
				height: width + 'px'
			});
			
			$( '<div/>' )
				.appendTo( '#reports-accordion > div:last-child > div' )
				.attr( 'class', 'image-expand' )
				.html( '<i class="fa fa-expand fa-2x"></i>' )
				.on( 'click', function(){
					//TODO: Show lightbox of report summary
					console.log( 'Show lightbox here' );
			});
		}

		var $textContainer = $( '<div class="text-container">' )
			.appendTo( '#reports-accordion > div:last-child' );
		
		$( '<p/>' ).appendTo( $textContainer  ).text( v.descri ).succinct({
			size: 300
		});
		
		$( '<div/>', {
				'class': 'button',
				html : 'View Report <i class="fa fa-chevron-right"></i>'
		}).appendTo( $textContainer  )
		.on( 'click', function(){
			//TODO: Show full report on click
			console.log( v );
			lightboxReport( $(this).parent().parent() );
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

function lightboxReport( $report ){
	var mask = $( "<div class='lightbox-mask lightbox'>" )
		.appendTo( "body" )
		.click( function(){
			$( ".lightbox" ).remove();
		});
	var $div = $report.clone()
		.removeClass( "ui-accordion" )
		.removeClass( "ui-accordion-content" )
		.addClass( "lightbox" )
		.css({
			position: "absolute",
			left: $report.offset().left,
			top: $report.offset().top,
			"margin-top": 0,
			"margin-left": 0,
			width: 300,
			height: $report.height(),
			transition: "none",
			padding: 0
		})
		.appendTo("body")
		.animate({
			left: "50%",
			top: "50%",
			"margin-left": -300,
			"margin-top": -135,
			width: 600,
			height: 300,
			padding: 20
		},loadFullImage);
	$( ".text-container", $div ).css( {
		"margin-left": 310,
		"margin-top": 0 
	});		
	// $( ".entry-title, .mask", $div ).animate({
	// 	top: 20,
	// 	left: 20
	// });
	$( ".image-expand", $div ).remove();
	function loadFullImage(){
		var $imageDiv = $( ".image-container", $div );
		var $image = $( "<img>" )
			.css({
				height: $imageDiv.height(),
				visibility: "hidden"
			})
			.appendTo( $imageDiv );
		$( "<div>" )
			.attr( "class", "image-loader" )
			.css({
				width: $imageDiv.width(),
				height: $imageDiv.height()
			})
			.append( '<i class="fa fa-spinner fa-spin"></i>' )
			.append( '<p>Loading full image...</p>' )
			.appendTo( $imageDiv );
		var src = $imageDiv.css( "background" ).match(/url\((.*)\)/)[1];
		src = src.replace( "=1000", "=6000" )
			.replace( "=800", "=6000" )
			.replace( "=20", "=100" );
		$image.attr( "src", src )
			.load( function(){
				$( ".image-loader", $div ).remove();
				var $this = $(this).css( {
						"height": "auto",
						"visibility": "visible"
					}),
					w,
					h;
				$this.parent().css({
					"width": "auto",
					"height": "auto",
					"overflow": "hidden"
				});
				if ( $this.width()> $this.height() ){
					w = Math.min( $this.width(), .9 * $(window).width() - 400 );
					h = w * $this.height() / $this.width();
				} else {
					h = Math.min( $this.height(), .9 * $(window).height() );
					w = h * $this.width() / $this.height();
				}
				$this.css("height",300).animate( {width:w,height:h} );
				$( ".text-container", $div ).animate( {
					"margin-left": w + 10
				});
				// $( ".mask", $div ).animate({
				// 	width: w
				// })
				$div.animate({
					height: h,
					width: w + 400,
					"margin-top": -h/2 - 20,
					"margin-left": -(w+400)/2 - 20
				});
				$( ".text-container", $div ).css( "max-height", h );
			})
	}
}