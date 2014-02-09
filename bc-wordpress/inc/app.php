<?php

$bc_app = bc_option('app');
$bc_url = bc_option('url');
$bc_style = bc_option('style');
$bc_security = bc_option('security');

$quick_hack = 0;
if ( have_posts() ) {
	while ( have_posts() ) {
		if($quick_hack < 1)
		{
			$quick_hack++;
			the_post();
			$post_id = get_the_ID();
			if(!empty($post_id))
			{
				$adhoc_url = get_post_meta($post_id, 'bc_app_url', true);
				if($adhoc_url) $bc_url = $adhoc_url;
			}
		}
		else
		{
			the_post();
		}
	}
}

if($bc_style == 'custom')
{
	if(!$bc_url) $bc_url = 'http://braincontrol.me/app/';
	echo '<iframe src="'.$bc_url.'" class="img hand-holder img-block active" id="app-frame"></iframe>';
}
else
{
	if($bc_security != 'private')
	{
		echo '<div id="braincontrol"></div>';
	}
	else
	{
		echo '<iframe src="'.wp_login_url(get_template_directory_uri().'/index.html').'" class="img hand-holder img-block active" id="app-frame"></iframe>';
	}
}
