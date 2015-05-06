<?php

if( array_key_exists( 'id', $_REQUEST ) ){
	$id = $_REQUEST['id'];
} else {
	// return
}

if( array_key_exists( 'size', $_REQUEST ) ) {
	$size =  $_REQUEST['size'];
} else {
	//return
}

if( array_key_exists( 'page', $_REQUEST ) ) {
	$page = $_REQUEST['page'];
} else {
	$page = 0;
}

//development vars
$id = 37;
$size = 'full';
$page = 1;

if( ! file_exists( getcwd(). '\images\\' . $id . '-' . $size . '-' . $page . '.jpg' ) ){
	file_put_contents( 'temp.pdf', file_get_contents( 'http://cdm15963.contentdm.oclc.org/utils/getfile/collection/p15963coll18/id/' . $id ) );

	//check amount of pages in pdf
	$im = new Imagick();
	$im->readimage( getcwd() . '\temp.pdf' );
	$pages = $im->getNumberImages();
	$im->clear();
	$im->destroy();

	//convert pdf page to jpg
	$imagick = new Imagick();
	$imagick->setResolution(300,300);

	$imagick->readimage( getcwd() . '\temp.pdf[' . $page . ']' );
	$imagick->setImageFormat( 'jpeg' );
	$imagick->writeImage( getcwd() . '\images\\' . $id . '-' . $size . '-' . $page . '.jpg' );
		
	$imagick->clear();
	$imagick->destroy();
	
	unlink( "temp.pdf" );
}

// header( "Location: images/$id-0.jpg" );

?>