<?php

$image = false;
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
				if(has_post_thumbnail())
				{
					$images = wp_get_attachment_image_src( get_post_thumbnail_id(), 'large');
					$image = $images[0];
				}
			}
		}
		else
		{
			the_post();
		}
	}
}

$html = '';
$intro = bc_option('intro');
$twitter = bc_option('twitter');
$facebook = bc_option('facebook');
$mailchimp = bc_option('mailchimp');
$parallax = bc_option('parallax');
$background = bc_option('background');
if(!$intro) $intro = __('Stay Informed - Follow Updates');
if($parallax == 'default')
{
	$html.='<div id="parallax-wrapper">';
		$html.='<div id="parallax-layer-01" class="parallax '.$background.'"></div>';
		$html.='<div id="parallax-layer-02" class="parallax"></div>';
	$html.='</div>';
}
elseif($parallax == 'custom')
{
	$html.='<div id="parallax-wrapper">';
		$html.='<div id="parallax-layer-01" class="parallax '.$background.'"></div>';
		$html.='<div id="parallax-layer-02" class="parallax" style="background-image:url('.$image.')"></div>';
	$html.='</div>';
}
echo $html;

?>

<div id="main-content">
	<div class="container">

		<div id="hand">
			<div id="updates">
				<p><?php echo $intro; ?></p>
				<ul class="social">
					
					<?php
					
					if($twitter) echo '<li class="twitter"><a href="'.$twitter.'" target="_blank">'.__('Twitter').'</a></li>';
					if($facebook) echo '<li class="facebook"><a href="'.$facebook.'" target="_blank">'.__('Facebook').'</a></li>';
					if($mailchimp) echo '<li class="email"><a href="#" target="_blank" id="mailchimp-popup" data-url="'.$mailchimp.'">'.__('Email').'</a></li>';

					echo '<li class="rss"><a href="'.get_bloginfo('rss2_url').'" target="_blank">'.__('RSS').'</a></li>';

					?>
					
				</ul>
			</div>
		</div>

		<?php

		get_template_part( 'inc/app', 'index' );

		?>

	</div>

	<div id="strip-wrapper">
		<div id="strip-bg" class="strips"></div>
		<div id="strip-inner" class="strips"></div>
		<div id="strip" class="strips">
			<div class="container">

				<?php
				$quick_hack = 0;
				if ( have_posts() ) {
					while ( have_posts() ) {
						if($quick_hack < 1)
						{
							$quick_hack++;
							the_post();
							?>

							<div class="spoke-wrapper active" id="tab">

								<div id="warning">

									<h2 id="warn" class="dev">

										<?php if(is_single()) { ?>
											<?php the_title(); ?>
										<?php } else { ?>
											<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
										<?php } ?>

									</h2>
									<p><?php the_content(); ?></p>

								</div>
							</div>

							<?php
							
						}
						else
						{
							the_post();
						}
					} // end while
				} // end if
				?>


			</div>
		</div>
	</div>

</div>
