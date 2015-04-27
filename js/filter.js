//type can be either alpha or date strings
function filter( type ){
	var filters = DataVars.filters,
		data = DataVars.data;
	
	//Default parameters, exit early for performance
	if( filters.minYear === 0 && filters.maxYear === 9999 && filters.tags.length === 0 && filters.format.length === 0 ) return;
	
	console.log( 'Please filter me' );
	console.log( DataVars.filters.format );
}