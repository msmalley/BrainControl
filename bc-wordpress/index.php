<?php

$style = bc_option('style');
get_template_part( 'inc/head', 'index' );

if($style != 'fullscreen')
{
	get_template_part( 'inc/header', 'index' );
	get_template_part( 'inc/content', 'index' );
	get_template_part( 'inc/modals', 'index' );
	get_template_part( 'inc/footer', 'index' );
}
else
{
	get_template_part( 'inc/app', 'index' );
}

get_template_part( 'inc/foot', 'index' );
