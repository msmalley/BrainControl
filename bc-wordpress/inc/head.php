<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />

    <title>
        <?php bloginfo('name'); ?> |
        <?php
		if(is_404())
		{
			bc_page_title();
		}
		else is_home() ? bloginfo('description') : wp_title('');
		?>
	</title>

	<meta name="description" content="<?php bloginfo( 'description' ); ?>">
	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>" type="text/css" media="screen" />
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
	<?php if ( is_singular() && get_option( 'thread_comments' ) ) wp_enqueue_script( 'comment-reply' ); ?>
	<?php wp_head(); ?>

</head>

<?php
$class = 'not-home';
if(is_home()) $class = 'home';
if(is_single()) $class.= ' is-single';
?>

<body
	data-url="<?php bloginfo('url'); ?>"
	data-theme="<?php echo get_template_directory_uri(); ?>"
	class="<?php echo $class; ?>"
>