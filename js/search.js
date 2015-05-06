function initSearch(){	
	$( '#search .typeahead' ).typeahead({
		highlight: true,
		minLength: 2
	},{
		name: 'searchResults',
		source: search()
	});
	
	$( '.typeahead' ).on( 'typeahead:selected', function( e, suggestion ){
		displayResults( suggestion );
	});
}

var search = function(){
	return function findMatches( q, cb ){
		var matches=[],
			substringRegex = new RegExp(q, 'i' );
			
		_.each( DataVars.data.entries, function( v, k, l ){
			if( substringRegex.test( v.descri ) || substringRegex.test( v.title ) ){
				matches.push( {'value': v.title, 'pointer': v.pointer, 'year': v.date.year });
			}
		});
		
		cb( matches );
	};
};

function displayResults( suggestion ){
	AppVars.selectedPoint = suggestion.pointer;
	selectYear( suggestion.year );
	$( '#entry' + suggestion.pointer + ' .entry-title' ).click();
}