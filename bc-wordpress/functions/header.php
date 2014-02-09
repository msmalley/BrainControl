<?php

function bc_scripts()
{
    global $pagenow;
    $home = get_template_directory_uri();
    if ( ! is_admin() && 'wp-login.php' != $pagenow )
    {
		$style = bc_option('style');
		if($style != 'custom')
		{
			wp_enqueue_script( 'base', $home.'/js/base.js', array('jquery'), 1, false );
			wp_enqueue_script( 'mustache', $home.'/js/mustache.js', array('jquery'), 1, false );
			wp_enqueue_script( 'crypto', $home.'/js/crypto.js', array('jquery'), 1, false );
			wp_enqueue_script( 'tx', $home.'/js/tx.js', array('jquery'), 1, false );
			wp_enqueue_script( 'qrcode', $home.'/js/qrcode.js', array('jquery'), 1, false );
			wp_enqueue_script( 'config', $home.'/js/config.js', array('base'), 1, true );
			wp_enqueue_script( 'blockchain', $home.'/js/blockchain.js', array('base'), 1, true );
			wp_enqueue_script( 'btc', $home.'/js/btc.js', array('base'), 1, true );
			wp_enqueue_script( 'buttons', $home.'/js/buttons.js', array('base'), 1, true );
			wp_enqueue_script( 'braincontrol', $home.'/js/braincontrol.js', array('jquery'), 1, true );
			wp_enqueue_script( 'init', $home.'/js/site/wp-init.js', array('parallax'), 1, true );
		}
		else
		{
			wp_enqueue_script( 'braincontrol', $home.'/js/site/wp-init-without-bc.js', array('jquery'), 1, true );
		}
		if($style != 'fullscreen')
		{
			wp_enqueue_script( 'parallax', $home.'/js/site/parallax.js', array('braincontrol'), 1, true );
		}
		// Header Scripts
		wp_enqueue_script( 'transition', $home.'/js/transition.js', array('jquery'), 1, false );
		wp_enqueue_script( 'bootstrap', $home.'/js/site/bootstrap.js', array('jquery'), 1, false );
		wp_enqueue_script( 'mbcommon', $home.'/js/site/common.js', array('jquery'), 1, false );
    }
	else
	{
		// ADMIN SCRIPTS
	}
}

function bc_styles()
{
    global $pagenow;
    if ( ! is_admin() && 'wp-login.php' != $pagenow )
    {
		$style = bc_option('style');
		$home = get_template_directory_uri();
		if($style != 'fullscreen')
		{
			wp_enqueue_style( 'less', $home.'/css/site/less.css');
		}
		else
		{
			wp_enqueue_style( 'fullscreen', $home.'/css/fullscreen.css');
		}
    }
}

function bc_meta() {
    ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <?php
}

