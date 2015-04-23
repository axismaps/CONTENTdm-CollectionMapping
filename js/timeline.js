function drawTimeline(){
	// testing
	for ( var i = 1900; i < 1970; i ++ ){
		drawYear( i );
	}
	selectYear( 1900 );
}

function drawYear( year ){
	var $div = $( "<div>" )
		.attr( "class", "timeline-year" )
		.attr( "id", "year" + year )
		.appendTo( "#timeline-inner" );
}

function selectYear( year ){
	if ( !$( "#year" + year).length ) return;
		$( ".timeline-year.active" ).removeClass( "active" );
	$( "#year" + year).addClass( "active" );
	$( "#year" ).html( year );

	AppVars.selectedYear = year;
	recenterTimeline();
}

function advanceTimeline(){
	if ( AppVars.selectedYear == undefined ) return;
	selectYear( AppVars.selectedYear + 1 );
}

function rewindTimeline(){
	if ( AppVars.selectedYear == undefined ) return;
	selectYear( AppVars.selectedYear - 1 );
}

function recenterTimeline(){
	if ( !$( ".timeline-year.active" ).length ) return;
	var left = -$( ".timeline-year.active" ).index() * $( ".timeline-year" ).outerWidth()
			+ ( $( "#timeline" ).width()  - $( ".timeline-year" ).outerWidth() ) / 2;
	$( "#timeline-inner" ).css( "left", left + "px" )

}