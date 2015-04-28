function drawPulse(){
	var $pulse = $( "#pulse" ).empty();
	var $pulseLine = $( "<div>" )
		.attr( "id", "pulse-line" )
		.appendTo( $pulse );
	$pulse.prepend( "<p>" + AppVars.years[0] + "</p>" )
		.append( "<p>" + AppVars.years[ AppVars.years.length-1 ] + "</p>" );

	var range = AppVars.years[ AppVars.years.length-1 ] - AppVars.years[0];

	AppVars.years.forEach( function(year){
		var count = $( "#year"+year ).children().length,
			size = Math.sqrt( count );
		var circle = $( "<div>" )
			.attr( "id", "p" + year )
			.attr( "class", "pulse-circle" )
			.css( {
				"left": 100*(year-AppVars.years[0])/range + "%",
				"width": 10 * size + "px",
				"height": 10 * size + "px",
				"margin-top": (-10 * size)/2 - 2 + "px",
				"margin-left": (-10 * size)/2 - 2 + "px",
				"z-index": 100-count
			})
			.click( function(){
				selectYear( year );
			})
			.appendTo( $pulseLine );
	});
}