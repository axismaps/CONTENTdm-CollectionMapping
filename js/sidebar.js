function sidebarEvents() {
	$( '#all-docs-button' ).on( 'click', function(){
		$( '#bar-expanded' ).hide();
		$( this ).addClass( 'selected' );
		$( '#reports-button' ).removeClass( 'selected' );
		$( '#secondary-buttons').find( '.selected' ).removeClass( 'selected' );
		
		allDocs();
	});
	
	$( '#reports-button' ).on( 'click', function(){
		$( this ).addClass( 'selected' );
		$( '#all-docs-button' ).removeClass( 'selected' );
		
		if( $( this ).hasClass( 'selected' ) && $( '#bar-expanded' ).is(':visible') && $( '#reports-expanded').is(':visible') ){
			$( '#bar-expanded' ).hide();
			$(this).removeClass( 'selected' );
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
		$( '.ui-accordion-content-active .image-expand' ).click();
	});
	
	$( '#about-button' ).on( 'click', function(){
		initAbout();
	});
}

function allDocs(){
	$( '.clear-text' ).click();
}

function initFilters(){
	$( '#filters-expanded' ).show();

	$( '#reports-button' ).removeClass( 'selected' );
	
	if ( $('#filters-expanded .expanded-section').children().length ) return;
	$( '.expanded-section' ).empty();
	
	//Date Slider
	$( '#date-range' ).append( '<div class="line"><span class="h4-title">Date Range</span><span class="clear-text">Clear</span></div>' );
	
	$( '#date-range .clear-text' ).on( 'click', function(){
		$( '#date-slider' ).slider( "values", [DataVars.data.minYear, DataVars.data.maxYear] );
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
		values: [ DataVars.data.minYear, DataVars.data.maxYear ],
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
		$( '#format p.selected' ).remove();
		$( '#format p' ).not( ':visible' ).show();
		DataVars.filters.format = [];
		filter();
	});
	
	
	$.map( DataVars.data.formats.sort(), function( v ){
		$('<p />' , {
			html: '<span class="format-item">' + getIcon( v ) + v + '</span>'
		})
		.appendTo( $( '#format' ) )
		.on( 'click', function() {
			
			var text = $( this )[0].innerText,
				html = $( this )[0].innerHTML;
				$that = $( this );
			$( this ).hide();
			
			DataVars.filters.format.push( text );
			filter();
			
			$( '<p class="selected" />' )
				.html( html )
				.append( "<i class='fa fa-check'></i>" )
				.insertAfter( $that.siblings( '.line' ) )
				.on( 'click', function(){
					console.log( $( '#format p:contains( ' + text + ')' ) );
					$( '#format p:contains(' + text + ')' ).show();
					DataVars.filters.format = _.without( DataVars.filters.format, text );
					filter();
					$( this ).remove();
				});
			
			$( '#format p.selected' ).sort(function( a, b ){
				if( $( a ).find( 'span' ).text() > $( b ).find( 'span' ).text() ) return 1;
				if( $( b ).find( 'span' ).text() > $( a ).find( 'span' ).text() ) return -1;
				return 0;
			}).detach().insertAfter( $that.siblings( '.line' ) );
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
		$( '#tags-expanded .tag.selected' ).remove();
		$( '#tags-expanded .tag.temp' ).remove();
		$( '.tag' ).not( ':visible' ).show();
		DataVars.filters.tags = [];
		filter();
	});
	
	$.map( DataVars.data.tags, function( v ){
		$('<p/>' , {
			text: v
		})
		.attr( 'class', 'tag' )
		.appendTo( sect )
		.on( 'click', function() {
			var text = $( this ).text(),
				$that = $( this );
			$( this ).hide();
			
			DataVars.filters.tags.push( text );
			filter();
			$( '<p class="tag selected" />' )
				.text( text )
				.append( "<i class='fa fa-check'></i>" )
				.insertAfter( $that.siblings( '.line' ) )
				.on( 'click', function(){
					$( '.tag:contains(' + text + ')' ).show();
					DataVars.filters.tags = _.without( DataVars.filters.tags, text );
					filter();
					$( this ).remove();
				});
			$( '.tag.selected' ).sort(function( a, b ){
				if( a.innerHTML > b.innerHTML ) return 1;
				if( b.innerHTML > a.innerHTML ) return -1;
				return 0;
			}).detach().insertAfter( $that.siblings( '.line' ) );
		});
	});
}

function createTempTag( name ){
	$( '<p class="tag temp selected">' + name.trim() + '</p>' )
		.insertAfter( $( '#tags-expanded .expanded-section .line' ) )
		.append( "<i class='fa fa-check'></i>" )
		.on( 'click', function(){
			DataVars.filters.tags = _.without( DataVars.filters.tags, name.trim() );
			$( this ).remove();
			filter();
		});
		
	DataVars.filters.tags.push( name.trim() );
	filter();
}


function initSummary(){
	$( '#summary-expanded' ).show();
}

function initAbout(){
	var mask = $( "<div class='lightbox-mask lightbox'>" )
		.appendTo( "body" )
		.click( function(){
			$( ".lightbox" ).remove();
		});
	var w = .8 * $(window).width(),
		h = .8 * $(window).height();
	
	var $div = $( '<div />' ).addClass( "lightbox" )
		.css({
			position: "absolute",
			left: '100px',
			top: '100px',
			"margin-top": 0,
			"margin-left": 0,
			width: 300,
			transition: "none",
			padding: 0
		})
		.appendTo("body")
		.animate({
			left: "50%",
			top: "50%",
			"margin-left": -w/2 -20,
			"margin-top": -h/2 - 20,
			width: w,
			height: h,
			padding: 20
		})
		.html( 'Lorem ipsum dolor sit amet, in eripuit corrumpit mea, ei vis facilisis voluptaria. At sea aperiam accusata, quo eius reque prodesset at. Pertinacia adolescens te his, quod wisi mnesarchum ne mea. Diceret commune accommodare vix et. Vidit forensibus at vel, cum in alii erroribus gloriatur. Modus idque no mei, alia minim sadipscing usu an.<br />Convenire reprehendunt in mea. Sit commune placerat et. Ea duo etiam expetendis deterruisset. Ut populo graecis vim.<br /> Summo fastidii eloquentiam in pro. Duo omnesque luptatum ut, no dicant facete intellegebat mel. Mea quando pertinax maluisset ex, eros ponderum assentior ne mei. Eu usu omittam iudicabit.<br /> Everti blandit eu eum. Erat salutatus vix cu, in veri scaevola his, usu placerat verterem ex. Omnes inimicus et nec, est at mutat mucius utamur. Te nostrum salutandi assueverit mea, mundi veritus deseruisse usu ea. Has elit falli omittantur te, an duo legere essent. Pri ea illud reque.' );
}

function getIcon( text ){
	var iconToUse = '',
		defaultIcon = '';
	
	_.each( DataVars.icons, function( icon ){
		if( text == icon.format ) iconToUse = icon['fa-icon'];
		if( icon.format == "Default" ) defaultIcon = icon['fa-icon'];
	});
	
	if( iconToUse ) return '<i class="fa ' + iconToUse + '"></i>';
	else return '<i class="fa ' + defaultIcon + '"></i>';
}