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
}

function drawYear( year ){
	var $div = $( "<div>" )
		.attr( "class", "timeline-year" )
		.attr( "id", "year" + year )
		.appendTo( "#timeline-inner" );
}

function selectYear( year ){
	if ( year == undefined || !$( "#year" + year).length ) return;
	AppVars.selectedYearIndex = AppVars.years.indexOf( year );
	$( ".timeline-year.active" ).removeClass( "active" );
	$( "#year" + year).addClass( "active" );
	$( "#year" ).html( year );

	AppVars.selectedYear = year;
	recenterTimeline();
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