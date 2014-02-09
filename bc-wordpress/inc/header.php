<?php

$sub = bc_option('sub');
$url = bc_option('url');
$logo = bc_option('logo');
$style = bc_option('style');
$home = get_bloginfo('url');
$name = get_bloginfo('name');
$lobster = bc_option('lobster');
if(!$lobster) $lobster = get_bloginfo('description');

$app_url = get_template_directory_uri().'/index.html';
if($style == 'custom') $app_url = $url;

$nav_options = array(
	'theme_location'	=> 'wp-menu',
	'container'			=> false,
	'items_wrap'		=> '<ul id="%1$s" class="%2$s nav navbar-nav">%3$s</ul>'
);

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
				if($adhoc_url) $app_url = $adhoc_url;
			}
		}
		else
		{
			the_post();
		}
	}
}

?>

<div id="header-bg"></div>

<div id="header">
	<div class="container">

		<div class="row">
			<div class="col-xs-6">

				<?php
				if($logo)
				{
					echo '<a href="'.$home.'" id="logo" style="background-image:url('.$logo.')">'.$name.'</a>';
				}
				else
				{
					echo '<a href="'.$home.'" id="naked-logo">'.$name.'</a>';
				}
				?>

			</div>
			<div class="col-xs-6">
				<div id="header-meta">
					<h4 class="lobster"><?php echo $lobster; ?></h4>
					<p><?php echo $sub; ?></p>
				</div>
			</div>
		</div>

		<nav class="navbar navbar-default">
			<?php wp_nav_menu($nav_options); ?>
		</nav>

		<a id="bc-standalone" class="btn btn-primary" href="<?php echo $app_url; ?>" target="_blank"><?php _e('FULL-SCREEN'); ?></a>

	</div>
</div>