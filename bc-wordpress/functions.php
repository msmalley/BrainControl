<?php

// Actions
add_action('init', 'bc_includes');
add_action( 'load-post.php', 'bc_post_meta' );
add_action( 'load-post-new.php', 'bc_post_meta');

// Theme Support
add_theme_support('post-thumbnails');

// Filters
add_filter('show_admin_bar', 'bc_false');
add_filter('wp_head', 'bc_meta');

// Includes
include_once(dirname(__FILE__).'/functions/utilities.php');
include_once(dirname(__FILE__).'/functions/options.php');
include_once(dirname(__FILE__).'/functions/wordpress.php');
include_once(dirname(__FILE__).'/functions/header.php');

// Check for BuddyPress
if(function_exists('bp_is_active'))
{
	include_once(dirname(__FILE__).'/functions/buddypress.php');
}

// Initialized Functions
function bc_includes()
{
	if(function_exists('bp_is_active'))
	{
		// Only use if BuddyPress activated
		buddypress_includes();
	}
	if(is_admin())
	{
		// Only use on admin pages
		bc_admin();
	}
    bc_menus();
    bc_scripts();
    bc_styles();
}
function bc_false()
{
    return false;
}
