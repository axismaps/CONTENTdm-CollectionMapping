function drawTimeline(){
	DataVars.data.entries = _.sortBy( DataVars.data.entries, function(d){
		return parseInt(d.date.year || 0)*100 + parseInt(d.date.month || 0)*10 + parseInt(d.date.day || 0);
	});
	var allYears = _.map( DataVars.data.entries, function(d){ return d.date.year } );

	AppVars.years = _.uniq( _.reject( allYears, function(d){ return !d } ) );

	for( var i in AppVars.years ){
		drawYear( AppVars.years[i] );
	}
	selectYear( AppVars.years[0] );

	$( ".entry-title" ).click( function(){
		var $entry = $(this).parent(),
			$year = $entry.parent();
		if ( !$year.hasClass( "active" ) || $entry.hasClass( "expanded" ) ) return;
		$( ".timeline-entry.expanded", $entry.parent() )
			.removeClass( "expanded" )
			.removeAttr( "style" );
		expandEntry( $entry );
	});
}

function expandEntry( $entry ){
	var totalHeight = $("#timeline-inner").height();
	$entry.addClass( "expanded" )
		.css( "height", totalHeight - $entry.siblings().length * 51  + "px");
}

function drawYear( year ){
	var $div = $( "<div>" )
		.attr( "class", "timeline-year" )
		.attr( "id", "year" + year )
		.appendTo( "#timeline-inner" );

	var entries = _.filter( DataVars.data.entries, function(d){
		return d.date.year == year;
	});
	_.each( entries, function(d,i){
		var $entry = $( "<div class='timeline-entry e" + i + "'>" );

		$( "<img>" )
			.attr( "data-src", "img/test.jpg" )	// fake image source for testing, obvs
			.appendTo( $entry );
		$( "<div class='mask'>" ).appendTo( $entry );

		$entry.append( "<p class='entry-title'>" + year + " | " + d.title + "</p>" )
			.append( "<p>Subject: " + d.subjec + "</p>" );

		$div.append( $entry );
	});
	expandEntry( $(".timeline-entry.e0", $div) );
}

function selectYear( year ){
	if ( year == undefined || !$( "#year" + year).length ) return;
	AppVars.selectedYearIndex = AppVars.years.indexOf( year );
	$( ".timeline-year.active" ).removeClass( "active" );
	$( "#year" + year).addClass( "active" );
	$( "#year" ).html( year );

	AppVars.selectedYear = year;
	recenterTimeline();

	loadTimelineImages( year );	// load selected year images before surrounding years
	for ( var i = AppVars.selectedYearIndex - 2; i <= AppVars.selectedYearIndex + 2; i++ ){
		if ( i != AppVars.selectedYearIndex ) loadTimelineImages( AppVars.years[i] );
	}
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
	var left = -$( ".timeline-year.active" ).index() * $( ".timeline-year" ).outerWidth()
			+ ( $( "#timeline" ).width()  - $( ".timeline-year" ).outerWidth() ) / 2;
	$( "#timeline-inner" ).css( "left", left + "px" )
}

function loadTimelineImages(year){
	if ( year == undefined || !$( "#year" + year).length ) return;
	$( ".timeline-entry img", $( "#year" + year) ).each( function(){
		if (typeof $(this).attr("src") !== typeof undefined && $(this).attr("src") !== false) {
			return;
		}
		$(this).attr( "src", $(this).attr("data-src") );
	});
}