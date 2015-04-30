<?php

if( checkCacheAge() OR array_key_exists( 'force', $_REQUEST ) ) {
	loadData();
}

$data = fopen( 'data.json', 'r' );
echo fgets( $data );
fclose( $data );


function checkCacheAge() {
	if( ! file_exists( 'data.json' ) ) {
		return true;
	}
	
	if( time() - filemtime( 'data.json' ) > 7 * 24 * 3600) {
		return true;
	} else {
		return false;
	}
}

function loadData( ){
	//TODO: if fields is greater than 5, need to make 2 or more cURL requests and merge
	
	$ch = curl_init();
	$temp = fopen( "temp.json", "w" );
	
	 //TODO: Trust actual certificate instead of all certificates. Do we need to do this or not?
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt( $ch, CURLOPT_FILE, $temp );
	
	$url = "https://server15963.contentdm.oclc.org/dmwebservices/index.php?q=dmQuery/";
	$url = $url . $_REQUEST["collection"] . '/0/title';
	if( ! empty ( $_REQUEST["fields"] ) ) {
		foreach( $_REQUEST["fields"] as $field ) {
			$url = $url . '!' . $field;
		}
	}
	$url = $url . "/title/1024/1/0/0/0/0/0/0/json";
	
	curl_setopt( $ch, CURLOPT_URL, $url );
	
	if( curl_exec( $ch ) === false ) {
		echo 'Curl error: ' . curl_error( $ch );
	}
	
	curl_close( $ch );
	fclose( $temp );
	
	processData();
}

function processData(){
	$temp_file = fopen( "temp.json", "r" );
	$temp_json = json_decode( fgets ( $temp_file ) );
	
	$json_file = fopen( "data.json", "w" );
	
	$formats = [];
	$tags = [];
	$all_tags = [];
	$minYear = 9999;
	$maxYear = 0;
	$entries = [];
	
	foreach( $temp_json -> records as $value ) {
		//Convert date into exact format just in case
		$value -> {'date'} = date_parse( $value -> {'date'} );
		
		$value -> {'location'} = [0, 0];

		if ( ! in_array( $value -> format, $formats ) )
			array_push( $formats, $value -> format);
		
		$entry_tags = [];
		$subjects = explode( ';', $value -> subjec);
		foreach( $subjects as $tag ){
			if( ! in_array( trim( $tag ), $entry_tags ) && trim( $tag ) != '' )
				array_push( $entry_tags, trim( $tag ) );
			if( trim( $tag ) != '' )
				array_push( $all_tags, trim( $tag ) );
		}
		$locations = explode( ';', $value -> covera );
		foreach( $locations as $tag ){
			if ( ! in_array( trim( $tag ), $entry_tags ) && trim( $tag ) != '' )
				array_push( $entry_tags, trim( $tag ) );
			if( trim( $tag ) != '' )
				array_push( $all_tags, trim( $tag ) );
		}
				
		$value -> {'tags'} = $entry_tags;
		array_push( $entries, $value );
		
		if ( $minYear > $value -> {'date'}['year'] )
			$minYear = $value -> {'date'}['year'];
		if ( $maxYear < $value -> {'date'}['year'] )
			$maxYear = $value -> {'date'}['year'];
	}
	
	foreach( array_count_values( $all_tags ) as $k => $v ){
		if( $v >= 5 ){
			array_push( $tags, $k );
		}
	};
	sort( $tags );
	
	$json = [ 
		'formats' => $formats,
		'tags' => $tags,
		'minYear' => $minYear,
		'maxYear' => $maxYear,
		'entries' => $entries,
	];
	
	fwrite( $json_file, json_encode( $json, JSON_NUMERIC_CHECK ) );
	fclose( $json_file );
	
	fclose( $temp_file );
	unlink( "temp.json" );
}

?>