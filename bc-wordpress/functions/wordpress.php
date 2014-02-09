<?php

function bc_menus()
{
	register_nav_menus(
		array(
			'wp-menu' => __( 'Main Menu' ),
		)
	);
}

function bc_meta_box()
{
	add_meta_box(
		'bc-app-url', // Unique ID
		esc_html__( 'Your App URL', 'example' ), // Title
		'bc_app_meta_box', // Callback function
		'post', // Admin page (or post type)
		'side', // Context
		'core' // Priority
	);
}

function bc_post_meta()
{
	add_action( 'add_meta_boxes', 'bc_meta_box' );
	add_action( 'save_post', 'bc_save_post_class_meta', 10, 2);
}

function bc_save_post_class_meta($post_id, $post)
{

	/* Verify the nonce before proceeding. */
	if ( !isset( $_POST['bc_app_nonce'] ) || !wp_verify_nonce( $_POST['bc_app_nonce'], basename( __FILE__ ) ) )
		return $post_id;

	/* Get the post type object. */
	$post_type = get_post_type_object( $post->post_type );

	/* Check if the current user has permission to edit the post. */
	if ( !current_user_can( $post_type->cap->edit_post, $post_id ) )
		return $post_id;

	/* Get the posted data and sanitize it for use as an HTML class. */
	$new_meta_value = ( isset( $_POST['bc-app-url'] ) ? sanitize_text_field( $_POST['bc-app-url'] ) : '' );

	/* Get the meta key. */
	$meta_key = 'bc_app_url';

	/* Get the meta value of the custom field key. */
	$meta_value = get_post_meta( $post_id, $meta_key, true );

	/* If a new meta value was added and there was no previous value, add it. */
	if ( $new_meta_value && '' == $meta_value )
		add_post_meta( $post_id, $meta_key, $new_meta_value, true );

	/* If the new meta value does not match the old value, update it. */
	elseif ( $new_meta_value && $new_meta_value != $meta_value )
		update_post_meta( $post_id, $meta_key, $new_meta_value );

	/* If there is no new meta value but an old value exists, delete it. */
	elseif ( '' == $new_meta_value && $meta_value )
		delete_post_meta( $post_id, $meta_key, $meta_value );
}

function bc_app_meta_box($object, $box)
{
	wp_nonce_field( basename( __FILE__ ), 'bc_app_nonce' );
	?>

	<p>
		<label for="bc-app-url"><?php _e( "Display this URL inside Mobile App demo:", 'braincontrol' ); ?></label>
		<br />
		<input class="widefat" type="text" name="bc-app-url" id="bc-app-url" value="<?php echo esc_attr( get_post_meta( $object->ID, 'bc_app_url', true ) ); ?>" size="30" />
	</p>
	
<?php }