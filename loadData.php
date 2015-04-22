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
	$ch = curl_init();
	$cache = fopen( "data.json", "w" );
	
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false); //TODO: Trust actual certificate instead of all certificates. Do we need to do this or not?
	curl_setopt( $ch, CURLOPT_FILE, $cache );
	curl_setopt( $ch, CURLOPT_URL, "https://server15963.contentdm.oclc.org/dmwebservices/index.php?q=dmQuery/p15963coll18/0/title!subjec!date!covera/title/1024/1/0/0/0/0/0/0/json" );
	
	if( curl_exec( $ch ) === false ) {
		echo 'Curl error: ' . curl_error( $ch );
	}
	
	curl_close( $ch );
	fclose( $cache );
	
	
	$data = '';
	
	//process data into json
	processData( $data );
	
	//output data to cache file
}

function processData( $data ){
	return $data;
}

?>