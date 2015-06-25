<?php

$collectionAlias = 'p15963coll18';

if( array_key_exists( 'id', $_GET ) ){
	$id = $_GET['id'];
} else {
	$id = 0; //set something so it doesn't crash
}

if( array_key_exists( 'size', $_GET ) ) {
	$size =  $_GET['size'];
} else {
	$size = 'full';
}

if( ! file_exists( 'cache/' . $id . '-' . $size . '.jpg' ) ){
	$file_info = json_decode( file_get_contents( 'http://server15963.contentdm.oclc.org/dmwebservices/index.php?q=dmGetItemInfo/' . $collectionAlias . '/' . $id . '/json' ) );
	
  $filetype = substr( $file_info->{'find'}, -3 );
	//file is a pdf
	if( $filetype == 'pdf' ) {
		
		file_put_contents( 'temp' . $id . '.pdf', file_get_contents( 'http://cdm15963.contentdm.oclc.org/utils/getfile/collection/' . $collectionAlias . '/id/' . $id ) );

		//convert pdf page to jpg
		$imagick = new Imagick();
		$imagick->setResolution(300,300);
		
		$imagick->readimage( getcwd() . '/temp' . $id . '.pdf[0]' );
		$imagick->setImageFormat( 'jpeg' );
		$imagick->writeImage( getcwd() . '/cache/' . $id . '-full.jpg' );
			
		$imagick->scaleImage( 400, 0 );
		$imagick->writeImage( getcwd() . '/cache/' . $id . '-small.jpg' );
					
		$imagick->clear();
		$imagick->destroy();
		
		unlink( "temp" . $id . ".pdf" );
	} elseif ( $filetype == 'jpg' OR $filetype == 'jpeg' OR $filetype == 'jp2' ){
    $file = json_decode( file_get_contents( 'http://cdm15963.contentdm.oclc.org/utils/ajaxhelper/?CISOROOT=' . $collectionAlias . '&CISOPTR=' . $id ) );
    $width = $file -> {'imageinfo'} -> {'width'};
    $height = $file -> {'imageinfo'} -> {'height'};
    
    if( $width > 1600 ){
      $scale = ( 1600 / $width ) * 100;
      $height = ( $height / $width ) * 1600;
      $width = 1600;
    } else {
      $scale = 100;
    }
    
    $url = 'http://cdm15963.contentdm.oclc.org/utils/ajaxhelper/?CISOROOT=' . $collectionAlias . '&CISOPTR=' . $id . '&action=2&DMWIDTH=' . $width . '&DMHEIGHT=' . $height . '&DMSCALE=' . $scale;
    
    file_put_contents( 'temp' . $id . '.' . $filetype, file_get_contents( $url ) );
		    
    $imagick = new Imagick();
    $imagick->readimage( getcwd() . '/temp' . $id . '.' . $filetype );
    $imagick->setImageFormat( 'jpeg' );
    $imagick->writeImage( getcwd() . '/cache/' . $id . '-full.jpg' );
    
    $imagick->scaleImage( 400, 0 );
    $imagick->writeImage( getcwd() . '/cache/'. $id . '-small.jpg' );
    
    $imagick->clear();
    $imagick->destroy();
    unlink( "temp" . $id . '.' . $filetype );
  }
}

header( "Location: cache/$id-$size.jpg" );
exit;
?>
