<?php

function bc_widgets()
{
    //register_widget('Expat_Widget_Related', array('title'=>__('Related Articles', 'expat')));
}

/* REFERENCE
class Expat_Widget_Related extends WP_Widget
{

    function __construct() {
		// Widget settings
		$widget_ops = array(
			'description' => __('Display 5 most recent related articles - only works on single article page', 'expat')
		);

		// Widget control settings
		$control_ops = array(
			'id_base' => 'widget-related'
		);

		// Create the widget
		$this->WP_Widget(
			'widget-related',
			__('Related Articles', 'expat'),
			$widget_ops,
			$control_ops
		);
    }

    public function widget($args, $instance)
    {
		if(is_single())
		{
			$title = apply_filters('widget_title', $instance['title']);
			echo $args['before_widget'];
			if(!empty( $title ))
			{
				echo $args['before_title'] . $title . $args['after_title'];
			}
			else
			{
				echo $args['before_title'] . __('Related Articles', 'expat') . $args['after_title'];
			}
			$category = false;
			$slugs = expat_end_slugs();
			$location = get_country_from_slugs();
			if(isset($slugs[3]) && $slugs[3] && isset($slugs[4]) && $slugs[4]) $category = $slugs[3];
			if($category)
			{
				$args = array(
					'category_name'		=> $category,
					'location'			=> $location,
					'posts_per_page'	=> 5
				);
				$the_query = new WP_Query($args);

				echo '<ul class="nav nav-list inline fa">';
				while($the_query->have_posts())
				{
					$the_query->the_post();
					echo '<li class="centered"><a href="'.get_permalink().'">' . get_the_title() . '</a></li>';
				}
				echo '</ul>';
				wp_reset_postdata();
			}
			?>



			<?php
			echo $args['after_widget'];
		}
    }

    public function form($instance)
    {
		// Back-End Display
    }

    public function update($new_instance, $old_instance)
    {
		// Back-End Functionality
    }
}
*/
