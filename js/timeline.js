function drawTimeline(){
	DataVars.filteredData.entries = _.sortBy( DataVars.filteredData.entries, function(d){
		return parseInt(d.date.year || 0)*1000 + parseInt(d.date.month || 0)*10 + parseInt(d.date.day || 0);
	});
	var allYears = _.map( DataVars.filteredData.entries, function(d){ return d.date.year } );

	AppVars.years = _.uniq( _.reject( allYears, function(d){ return !d } ) );

	$("#timeline-inner").empty();
	for( var i in AppVars.years ){
		drawYear( AppVars.years[i] );
	}

	drawPulse();
	selectYear( AppVars.years[0] );

	$( ".entry-title" ).click( function(){
		var $entry = $(this).parent().parent(),
			$year = $entry.parent();
		selectPoint( $entry.attr( 'id' ).replace( 'entry', '' ) );
		if ( !$year.hasClass( "active" ) || $entry.hasClass( "expanded" ) ) return;
		$( ".timeline-entry.expanded", $entry.parent() )
			.removeClass( "expanded" )
			.scrollTop( 0 )
			.removeAttr( "style" );
		expandEntry( $entry );
	});
}

function expandEntry( $entry ){
	var totalHeight = $("#timeline-inner").height();
	$entry.addClass( "expanded" )
		.css( "height", Math.max( 500, totalHeight - $entry.siblings().length * 51 )  + "px");
}

function drawYear( year ){
	var $div = $( "<div>" )
		.attr( "class", "timeline-year" )
		.attr( "id", "year" + year )
		.appendTo( "#timeline-inner" )
		.click( function(){
			if ( !$(this).hasClass( "active" ) ) selectYear( year );
		})

	var entries = _.filter( DataVars.filteredData.entries, function(d){
		return d.date.year == year;
	});
	_.each( entries, function(d,i){
		var $entry = $( "<div class='timeline-entry e" + i + "' id='entry" + d.pointer + "'>" );
		var $imageContainer = $( "<div class='image-container'>" )
			.appendTo( $entry );
		$( "<img>" )
			.attr( "data-src", "php/loadImage.php?id=" + d.pointer + '&size=small')
			.appendTo( $imageContainer );
		$( "<div class='mask'>" ).appendTo( $imageContainer );

		var title = $( "<p>" ).attr( "class", "entry-title" );
		if ( d.date.day )
			title.html( d.date.month + "/" + d.date.day + "/" + year + " | " + d.title )
		else
			title.html( year + " | " + d.title );
		$imageContainer.append( title );

		var $textContainer = $( "<div class='text-container'>" )
			.append( "<p class='entry-description'>" + d.descri + "</p>" )
			.appendTo( $entry );
		_.each( DataVars.data.headers, function(header,prop){
			if ( !header.tag || !d[prop] ) return;
			$textContainer.append( "<p><strong>" + header.name.toUpperCase() + ":</strong> " + getTagLinks(d[prop]) + "</p>" );
		});
		
		var foundStudentReport = false,
			$studentReports = $( '<div id="studentReports"><strong>STUDENT REPORTS: </strong></div>');
		_.each( DataVars.reports, function( entry, index ){
			if( _.indexOf( entry.Documents, d.pointer ) >= 0 ){
				foundStudentReport = true;
				var $buttonDiv = $( '<div/>', {
					'class': 'button',
					html : 'View Report <i class="fa fa-chevron-right"></i>'
				})
				.on( 'click', function(){
					loadReport( entry );
				});
				$( '<div><p class="italic">' + entry.Title + '</p></div>' ).appendTo( $studentReports ).append( $buttonDiv );
				
			}
		});
		if( foundStudentReport === true ) $studentReports.appendTo( $textContainer );

		$( "a.tag-link", $entry ).click( function(){
			var name = $(this).html();
			if( $( '.tag:contains("' + name + '")').length >= 1 ) {
				$( ".tag:contains('" + name + "')" ).click();
			} else{
				createTempTag( name );
			}
		});

		$( '<div class="image-expand"><i class="fa fa-expand fa-2x"></i></div>' )
			.appendTo( $imageContainer )
			.on( 'click', function(){
				lightboxEntry( $entry, d );
			});

		$div.append( $entry );
	});
	expandEntry( $(".timeline-entry.e0", $div) );
}

function selectYear( year, noAutoScroll, noImages ){
	if ( year == undefined || !$( "#year" + year).length ) return;
	AppVars.selectedYearIndex = AppVars.years.indexOf( year );
	$( ".timeline-year.active" ).removeClass( "active" );
	$( ".pulse-circle.active" ).removeClass( "active" );
	$( "#year" + year).addClass( "active" );
	$( ".p" + year).addClass( "active" );
	$( "#year" ).html( year );

	AppVars.selectedYear = year;
	if ( !noAutoScroll ) recenterTimeline();

	if ( noImages ) return;
	loadTimelineImages( year );	// load selected year images before surrounding years
	
	selectPoint( $( '.timeline-year.active .timeline-entry:first-child' ).attr( 'id' ).replace( 'entry', '' ) );
}

function advanceTimeline(){
	if ( AppVars.selectedYear == undefined ) return;
	selectYear( AppVars.years[ AppVars.selectedYearIndex + 1 ] );
}

function rewindTimeline(){
	if ( AppVars.selectedYear == undefined ) return;
	selectYear( AppVars.years[ AppVars.selectedYearIndex - 1 ] );
}

function recenterTimeline(){
	if ( !$( ".timeline-year.active" ).length ) return;
	var left = $( ".timeline-year.active" ).index() * $( ".timeline-year" ).outerWidth()
			- ( $( "#timeline" ).width()  - $( ".timeline-year" ).outerWidth() ) / 2;
	$( "#timeline-inner" ).off( "scroll" )
		.stop()
		.animate( { scrollLeft: left }, function(){
			$( "#timeline-inner" ).on( "scroll", timelineScroll );
		});
	AppVars.timelineRecenterFlag = false;
}

function timelineScroll(){
	var left = $( this ).scrollLeft() + $("#timeline").width() / 2,
		index = parseInt( left / 400 );
	var year;
	if ( left == 0 ) year = AppVars.years[0];
	else if ( Math.abs( left - (AppVars.years.length - $( this ).parent().width()) ) < 10 ) year = AppVars.years[ AppVars.years.length - 1 ];
	else year = AppVars.years[ index ];
	clearTimeout( AppVars.scrollTimeout );
	AppVars.scrollTimeout = setTimeout( timelineScrollStop, 100 );
	if ( year != AppVars.selectedYear ){
		selectYear( year, true, true );
		AppVars.timelineRecenterFlag = true;
	}
}
function timelineScrollStop(){
	if ( !AppVars.timelineRecenterFlag ) return;
	loadTimelineImages( AppVars.selectedYear );
	recenterTimeline();
}

function loadTimelineImages(year){
	year = year || AppVars.selectedYear;
	if ( year == undefined || !$( "#year" + year).length ) return;
	var index = AppVars.years.indexOf( year );
	for ( var i = index - 2; i <= index + 2; i++ ){
		var y = AppVars.years[i];
		$( ".timeline-entry img", $( "#year" + y) ).each( function(){
			if (typeof $(this).attr("src") !== typeof undefined && $(this).attr("src") !== false) {
				return;
			}
			$(this).attr( "src", $(this).attr("data-src") );
		});
	}	
}
function getTagLinks( tag ){
	var tags = tag.replace(/; /g,";").split(";");
	tags.forEach( function(t){
		tag = tag.replace( t, "<a class='tag-link' href='#'>" + t + "</a>" );
	});
	return tag;
}