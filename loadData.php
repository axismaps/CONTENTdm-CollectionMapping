<?php

if( checkCacheAge() ) {
	loadData();
}

//return cache data to the requesting page


function checkCacheAge() {
	echo "Refreshing the cache";
	return true;
}

function loadData( ){
	$data = '';
	
	//process data into json
	processData( $data );
	
	//output data to cache file
}

function processData( $data ){
	return $data;
}

?>