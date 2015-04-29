function drawPulse(){
	var $pulse = $( "#pulse" ).empty();
	var $pulseLine = $( "<div>" )
		.attr( "id", "pulse-line" )
		.appendTo( $pulse );
	$pulse.prepend( "<p>" + AppVars.years[0] + "</p>" )
		.append( "<p>" + AppVars.years[ AppVars.years.length-1 ] + "</p>" );

	var range = AppVars.years[ AppVars.years.length-1 ] - AppVars.years[0],
		interval = parseInt( range/20 );

	for( var year = AppVars.years[0]; year <= AppVars.years[ AppVars.years.length-1 ]; year += interval ){
		var i = 0,
			count = 0,
			actualYears = [];
		while( i < interval ){
			if ( $( "#year"+(year+i) ).children().length ) actualYears.push(year+i);
			count += $( "#year"+(year+i) ).children().length;
			i++;
		}
		if ( !count ) continue;
		var	middleYear = parseInt( actualYears[0] + (actualYears[ actualYears.length - 1 ] - actualYears[0])/2 ),
			label = actualYears.length == 1 ? actualYears[0] : ( actualYears[0] + "–" + actualYears[ actualYears.length - 1 ] );
		var size = Math.min( 7, Math.sqrt( count ) );
		var circle = $( "<div>" )
			.attr( "id", "p" + actualYears[ parseInt((actualYears.length-1)/2) ] )
			.attr( "class", "pulse-circle" )
			.attr( "title", label + ": " + count + " item" + (count > 1 ? "s" : "") )
			.css( {
				"left": 100*(middleYear-AppVars.years[0])/range + "%",
				"width": 6 * size + "px",
				"height": 6 * size + "px",
				"margin-top": (-6 * size)/2 - 1 + "px",
				"margin-left": (-6 * size)/2 - 1 + "px",
				"z-index": 100-count
			})
			.click( function(){
				selectYear( parseInt( $(this).attr("id").replace("p","") ) );
			})
			.appendTo( $pulseLine );
		actualYears.forEach( function(y){
			circle.addClass("p"+y);
		});
	}

}