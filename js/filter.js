//type can be either alpha or date strings
function filter( type ){
	var filters = DataVars.filters,
		data = DataVars.data;
		
	console.log( 'filtering' );
		
	//Default parameters, exit early for performance
	if( filters.minYear === 0 && filters.maxYear === 9999 && filters.tags.length === 0 && filters.format.length === 0 ) {
		DataVars.filteredData = data;
	} else {
	
		var fD = {
			minYear: 9999,
			maxYear: 0,
			entries: []
		};
		_.each( data.entries, function( v, k, l ){
			if( v.date.year >= filters.minYear && 
				v.date.year <= filters.maxYear &&
				_.indexOf( filters.format, v.filetype ) >= 0 ) {
					
					if( fD.minYear >= v.date.year ) fD.minYear = v.date.year;
					if( fD.maxYear <= v.date.year ) fD.maxYear = v.date.year;
					fD.entries.push( v );
			}
		});
		
		DataVars.filteredData = fD;
	}
	
	console.log( DataVars.filteredData );
}