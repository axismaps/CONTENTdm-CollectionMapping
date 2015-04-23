function drawTimeline(){
	// testing
	for ( var i = 1900; i < 1970; i ++ ){
		drawEvent( i );
	}
}

function drawEvent( year ){
	var $div = $( "<div>" )
		.attr( "class", "timeline-year" )
		.attr( "id", "year" + year )
		.appendTo( "#timeline-inner" );
}

function selectYear( year ){
	$( "#timeline-inner" ).css( "left", -$( "#year" + year).index() * $( ".timeline-year" ).outerWidth() )
}

function advanceTimeline(){

}

function rewindTimeline(){

}