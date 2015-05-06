function initSearch(){	
	$( '#search .typeahead' ).typeahead({
		highlight: true,
		minLength: 2
	},{
		name: 'searchResults',
		source: search()
	});
}

var search = function(){
	return function findMatches( q, cb ){
		var matches=[],
			substringRegex = new RegExp(q, 'i' );
			
		_.each( DataVars.data.entries, function( v, k, l ){
			if( substringRegex.test( v.descri ) || substringRegex.test( v.title ) ){
				matches.push( {'value': v.title });
			}
		});
		
		cb( matches );
	};
};