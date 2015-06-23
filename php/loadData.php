<?php

//load fields into array
$fields = array();
$fields_file = fopen( "../csv/fields.csv", "r" );
while ( !feof( $fields_file ) ){
	$field = fgetcsv( $fields_file, 1024 );
	array_push($fields, $field);
}
fclose( $fields_file );

//load field mappings into array
$field_mapping = array();
$field_mapping_file = fopen( "../csv/field_maps.csv", "r" );
while ( !feof( $field_mapping_file ) ){
	$field = fgetcsv( $field_mapping_file, 1024 );
  $field_mapping[$field[0]] = $field[1];
}
fclose( $field_mapping_file );


if( checkCacheAge() OR array_key_exists( 'force', $_REQUEST ) ) {
	loadData( $fields );
}

$data = fopen( 'cache/data.json', 'r' );
echo fgets( $data );
fclose( $data );


//END OF MAIN - START OF FUNCTIONS

function checkCacheAge() {
	if( ! file_exists( 'cache/data.json' ) ) {
		return true;
	}
	
	if( time() - filemtime( 'cache/data.json' ) > 7 * 24 * 3600) {
		return true;
	} else {
		return false;
	}
}

function loadData( $fields ){
	if( file_exists( "cache" ) == FALSE ){
		mkdir( "cache" );
	}
	
  $numRequests = ceil( count($fields) / 5 );
  for( $i = 1; $i <= $numRequests; $i++ ){
    $arr_begin = ($i - 1) * 5;
    curlRequest( array_slice( $fields, $arr_begin, 5 ), $i );
  }
  
  if( $numRequests > 1 ){
    $temp1_file = fopen( "cache/temp1.json", "r" );
    $temp1_json = json_decode( fgets ( $temp1_file ), true );
    fclose( $temp1_file );
    unlink( "cache/temp1.json" );
      
    for( $i = 2; $i <= $numRequests; $i++ ){
      $temp_file = fopen( "cache/temp" . $i . ".json", "r" );
      $temp_json = json_decode( fgets ( $temp_file ), true );
      
      $temp1_json = mergeArrays( $temp1_json, $temp_json );
      
      fclose( $temp_file );
      unlink( "cache/temp" . $i . ".json" );
    }
    
    $tempFinal_file = fopen( "cache/temp-final.json", "w" );
    fwrite( $tempFinal_file, json_encode( $temp1_json, JSON_NUMERIC_CHECK ) );
    fclose( $tempFinal_file );
  }
	
	processData( $fields );
}

function mergeArrays( $arr1, $arr2 ){
  foreach( $arr2["records"] as $value2 ){
    foreach( $arr1["records"] as &$value1 ){
      if( $value2["pointer"] == $value1["pointer"] ){
        $value1 = array_merge( $value1, $value2 );
      }
    }
  }
  
  return $arr1;
}

function curlRequest( $fields, $i ){
  $ch = curl_init();
	$temp = fopen( "cache/temp" . $i . ".json", "w" );
	
	 //TODO: Trust actual certificate instead of all certificates. Do we need to do this or not?
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt( $ch, CURLOPT_FILE, $temp );
	
	$url = "https://server15963.contentdm.oclc.org/dmwebservices/index.php?q=dmQuery/";
	$url = $url . $_REQUEST["collection"] . '/0/title';
	if( ! empty ( $fields ) ) {
		foreach( $fields as $field ) {
			$url = $url . '!' . $field[0];
		}
	}
	$url = $url . "/title/1024/1/0/0/0/0/0/0/json";
	
	curl_setopt( $ch, CURLOPT_URL, $url );
  curl_setopt($ch, CURLOPT_TIMEOUT, 60);
	
	if( curl_exec( $ch ) === false ) {
		echo 'Curl error: ' . curl_error( $ch );
	}
	
	curl_close( $ch );
	fclose( $temp );
}

function processData( $fields ){
  global $field_mapping;
  
	$temp_file = fopen( "cache/temp-final.json", "r" );
	$temp_json = json_decode( fgets ( $temp_file ) );
	
	$json_file = fopen( "cache/data.json", "w" );
	
	$categories = [];
	$tags = [];
	$all_tags = [];
	$minYear = 9999;
	$maxYear = 0;
	$entries = [];
	$headers = [];
	
	foreach( $fields as $field ){
		$headers[ $field[0] ] = array(
			'name' => $field[1],
			'tag' => strtolower($field[2]) === 'true' ? true : false
		);
	}
	
	foreach( $temp_json -> records as $value ) {
		
    //if filetype is .cpd, skip as we can't do anything with it
		if( substr( $value -> {'find'}, -3 ) == 'cpd' ){
			continue;
		}
		
		//Convert date into exact format just in case
		$value -> {'date'} = date_parse( $value -> {$field_mapping['date']} );
		if( $value -> {'date'}['year'] == 0 ){
			continue;
		}

    //category
		if ( ! in_array( $value -> {$field_mapping['category']}, $categories ) )
			array_push( $categories, $value -> {$field_mapping['category']});
		
    //tags
		$entry_tags = [];
		foreach ( $headers as $key => $header_value ){
		 	if ( $header_value['tag'] != true ) continue;
			$tags_split = explode( ';', $value -> $key );
			foreach( $tags_split as $tag ){
				if( ! in_array( trim( $tag ), $entry_tags ) && trim( $tag ) != '' )
					array_push( $entry_tags, trim( $tag ) );
				if( trim( $tag ) != '' )
					array_push( $all_tags, trim( $tag ) );
			}
		}
    
    //location
		$locations = explode( ';', $value -> {$field_mapping['location']} );
		foreach( $locations as $location ){
			$location = trim( $location );
			$value -> {'location'} = getLocation( $location );
		}
		
    //compilation tags
		$value -> {'tags'} = $entry_tags;
		array_push( $entries, $value );
		
    //max and min years
		if ( $minYear > $value -> {'date'}['year'] && $value -> {'date'}['year'] > 0 )
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
		'categories' => $categories,
		'tags' => $tags,
		'minYear' => $minYear,
		'maxYear' => $maxYear,
		'entries' => $entries,
		'headers' => $headers
	];
	
	fwrite( $json_file, json_encode( $json, JSON_NUMERIC_CHECK ) );
	fclose( $json_file );
	
	fclose( $temp_file );
	unlink( "cache/temp-final.json" );
}

function getLocation( $name ){
	
	$location_file = fopen( "../csv/locations.csv", "r+" );
	while ( !feof( $location_file ) ){
		$line = fgetcsv( $location_file, 1024 );
		if( $line[0] == $name ) {
			$location = array( 'name' => $line[0], 'lat' => $line[1], 'lng' => $line[2] );
			fclose( $location_file );
			return $location;
		}
	}
  fclose( $location_file );

  $location = searchLocation( $name );
  return $location;
}

function searchLocation( $name ){
	$escaped_params = urlencode( '"' . $name . '"' );
	$url = 'http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluu82d622l%2C70%3Do5-94ygha&location=' . $escaped_params;
	echo $url . ' ';
	$json = file_get_contents( $url );
	$jsonArr = json_decode($json);

	$lat = $jsonArr->results[0]->locations[0]->latLng->lat;
	$lon = $jsonArr->results[0]->locations[0]->latLng->lng;

  addLocationToCSV( $name, $lat, $lon );
  $location = array( 'name' => $name, 'lat' => $lat, 'lng' => $lon );
  return $location;
}

function addLocationToCSV( $name, $lat, $lon ){
  $location_file = fopen( "../csv/locations.csv", "r+" );
	fputcsv( $location_file, [ $name, $lat, $lon ] );
	fclose( $location_file );
}

?>