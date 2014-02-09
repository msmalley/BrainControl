<?php

function buddypress_includes()
{
	$home = get_template_directory_uri();
	wp_enqueue_style( 'expat_bp', $home.'/css/bp.css', 'style');
}
