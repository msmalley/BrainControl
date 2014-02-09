<?php

function bc_admin()
{
	$bc_theme_settings = new BCSettingsPage();
}

function bc_option($type = false)
{
	$options = get_option('bc_settings');
	if(is_array($options) && $type && isset($options[$type]))
	{
		return $options[$type];
	}
	return false;
}

class BCSettingsPage
{
    private $options;
    public function __construct()
    {
        add_action('admin_menu', array($this, 'bc_settings_page'));
        add_action('admin_init', array($this, 'bc_init'));
    }

    public function bc_settings_page()
    {
        add_options_page(
            __('BrainControl Theme Options'),
            __('BrainControl Settings'),
            'manage_options',
            'bc-settings',
            array( $this, 'create_admin_page' )
        );
    }

    public function create_admin_page()
    {
        // Set class property
        $this->options = get_option( 'bc_settings' );
        ?>
        <div class="wrap">
            <?php screen_icon(); ?>
            <h2><?php _e('BrainControl Theme Options'); ?></h2>
            <form method="post" action="options.php">
            <?php
                // This prints out all hidden setting fields
                settings_fields( 'layout_options' );
                do_settings_sections( 'bc-settings' );
                submit_button();
            ?>
            </form>
        </div>
        <?php
    }

    public function bc_init()
    {
        register_setting(
            'layout_options', // Option group
            'bc_settings', // Option name
            array( $this, 'sanitize' ) // Sanitize
        );

        register_setting(
            'braincontrol_options', // Option group
            'bc_settings', // Option name
            array( $this, 'sanitize' ) // Sanitize
        );

        register_setting(
            'theme_options', // Option group
            'bc_settings', // Option name
            array( $this, 'sanitize' ) // Sanitize
        );

        register_setting(
            'your_options', // Option group
            'bc_settings', // Option name
            array( $this, 'sanitize' ) // Sanitize
        );

        register_setting(
            'share_options', // Option group
            'bc_settings', // Option name
            array( $this, 'sanitize' ) // Sanitize
        );

        add_settings_section(
            'layout_options', // ID
            __('<hr><br />Fundamental Layout Options'), // Title
            array( $this, 'layout_intro' ), // Callback
            'bc-settings' // Page
        );

        add_settings_section(
            'braincontrol_options', // ID
            __('<p>&nbsp;</p><hr><p>&nbsp;</p>BrainControl Security Options'), // Title
            array( $this, 'braincontrol_intro' ), // Callback
            'bc-settings' // Page
        );

        add_settings_section(
            'theme_options', // ID
            __('<p>&nbsp;</p><hr><p>&nbsp;</p>Theme Text & Button Options'), // Title
            array( $this, 'theme_intro' ), // Callback
            'bc-settings' // Page
        );

        add_settings_section(
            'your_options', // ID
            __('<p>&nbsp;</p><hr><p>&nbsp;</p>Your App Options'), // Title
            array( $this, 'your_intro' ), // Callback
            'bc-settings' // Page
        );

        add_settings_section(
            'share_options', // ID
            __('<p>&nbsp;</p><hr><p>&nbsp;</p>Your App Options'), // Title
            array( $this, 'share_intro' ), // Callback
            'bc-settings' // Page
        );

        add_settings_field(
            'style', // ID
            __('Style'), // Title
            array( $this, 'style_callback' ), // Callback
            'bc-settings', // Page
            'layout_options' // Section
        );

        add_settings_field(
            'app', // ID
            __('The App'), // Title
            array( $this, 'app_callback' ), // Callback
            'bc-settings', // Page
            'layout_options' // Section
        );

		add_settings_field(
            'security', // ID
            __('Security'), // Title
            array( $this, 'security_callback' ), // Callback
            'bc-settings', // Page
            'braincontrol_options' // Section
        );

		add_settings_field(
            'logo', // ID
            __('Logo URL'), // Title
            array( $this, 'logo_callback' ), // Callback
            'bc-settings', // Page
            'theme_options' // Section
        );

		add_settings_field(
            'lobster', // ID
            __('Lobster Header'), // Title
            array( $this, 'lobster_callback' ), // Callback
            'bc-settings', // Page
            'theme_options' // Section
        );

		add_settings_field(
            'sub', // ID
            __('Sub Header Text'), // Title
            array( $this, 'sub_callback' ), // Callback
            'bc-settings', // Page
            'theme_options' // Section
        );

		add_settings_field(
            'footer', // ID
            __('Footer Text'), // Title
            array( $this, 'footer_callback' ), // Callback
            'bc-settings', // Page
            'theme_options' // Section
        );

		add_settings_field(
            'background', // ID
            __('Background Colours'), // Title
            array( $this, 'background_callback' ), // Callback
            'bc-settings', // Page
            'theme_options' // Section
        );

		add_settings_field(
            'parallax', // ID
            __('Parallax Options'), // Title
            array( $this, 'parallax_callback' ), // Callback
            'bc-settings', // Page
            'theme_options' // Section
        );

		add_settings_field(
            'url', // ID
            __('Default URL for App'), // Title
            array( $this, 'url_callback' ), // Callback
            'bc-settings', // Page
            'your_options' // Section
        );

		add_settings_field(
            'intro', // ID
            __('Share Intro'), // Title
            array( $this, 'intro_callback' ), // Callback
            'bc-settings', // Page
            'share_options' // Section
        );

		add_settings_field(
            'twitter', // ID
            __('Twitter URL'), // Title
            array( $this, 'twitter_callback' ), // Callback
            'bc-settings', // Page
            'share_options' // Section
        );

		add_settings_field(
            'facebook', // ID
            __('Facebook URL'), // Title
            array( $this, 'facebook_callback' ), // Callback
            'bc-settings', // Page
            'share_options' // Section
        );

		add_settings_field(
            'mailchimp', // ID
            __('Mailchimp URL'), // Title
            array( $this, 'mailchimp_callback' ), // Callback
            'bc-settings', // Page
            'share_options' // Section
        );
    }

    public function sanitize( $input )
    {
		if(is_array($input))
		{
			foreach($input as $key => $value)
			{
				$input[$key] = sanitize_text_field($value);
			}
		}
		return $input;
    }

    public function layout_intro()
    {
        _e('Options related to the base layout / usage of this theme.');
    }

    public function braincontrol_intro()
    {
        _e('Options only used if using BrainControl (the Bitcoin wallet).');
    }

    public function theme_intro()
    {
        _e('These options are not required if using the fullscreen BrainControl application.');
    }

    public function your_intro()
    {
        _e('These options are only required if not using the BrainControl Bitcoin wallets.');
    }

    public function share_intro()
    {
        _e('These options control the icons under the phone - where the RSS icon is automatically shown.');
    }

    public function style_callback()
    {
		$custom_selected = false;
		$marketing_selected = false;
		$fullscreen_selected = false;
		if(!isset($this->options['style'])) $this->options['atyle'] = false;
		$option = $this->options['style'];
		if($option == 'custom') $custom_selected = 'selected="selected"';
		elseif($option == 'marketing') $marketing_selected = 'selected="selected"';
		elseif($option == 'fullscreen') $fullscreen_selected = 'selected="selected"';
        echo '<select type="text" id="style" name="bc_settings[style]" style="width: 300px">';
			echo '<option value="fullscreen" '.$fullscreen_selected.'>'.__('Fullscreen BrainControl Only').'</option>';
			echo '<option value="marketing" '.$marketing_selected.'>'.__('Big Hand Marketing and BrainControl').'</option>';
			echo '<option value="custom" '.$custom_selected.'>'.__('Big Hand Marketing with Your Own App').'</option>';
		echo '</select>';
		echo '<p class="small-print">'.__('If using BrainControl - everything will be taken care of behind the scenes with limit access to update the theme.').'</p>';
		echo '<p class="small-print">'.__('If using Your Own App, you will need to add a default URL below.').'</p>';
    }

    public function app_callback()
    {
		$same_selected = false;
		$unique_selected = false;
		if(!isset($this->options['app'])) $this->options['app'] = false;
		$option = $this->options['app'];
		if($option == 'same') $same_selected = 'selected="selected"';
		elseif($option == 'unique') $unique_selected = 'selected="selected"';
        echo '<select type="text" id="app" name="bc_settings[app]" style="width: 300px">';
			echo '<option value="same" '.$same_selected.'>'.__('Each Page / Section uses Same App').'</option>';
			echo '<option value="unique" '.$unique_selected.'>'.__('Each Page / Section has Unique App').'</option>';
		echo '</select>';
		echo '<style>.form-table p.small-print { display: block; font-size: 11px; margin: 5px; }</style>';
		echo '<p class="small-print">'.__('If using unique app in conjunction with your own app - you can set the source of the iFrame in the individual post / page meta settings.').'</p>';
		echo '<p class="small-print">'.__('If using unique app in conjunction with BrainControl - the slug will be used to access a "step" within their app (can be governed by config.js).').'</p>';
    }

    public function security_callback()
    {
		$public_selected = false;
		$private_selected = false;
		if(!isset($this->options['security'])) $this->options['security'] = false;
		$option = $this->options['security'];
		if($option == 'public') $public_selected = 'selected="selected"';
		elseif($option == 'private') $private_selected = 'selected="selected"';
        echo '<select type="text" id="security" name="bc_settings[security]" style="width: 600px">';
			echo '<option value="public" '.$public_selected.'>'.__('PUBLIC - Everyone has the ability to create and access the wallet interface').'</option>';
			echo '<option value="private" '.$private_selected.'>'.__('PRIVATE - Only logged-in users can create and access the wallet interface').'</option>';
		echo '</select>';
    }

    public function logo_callback()
    {
		if(!isset($this->options['logo'])) $this->options['logo'] = false;
		$option = $this->options['logo'];
        echo '<input type="text" id="logo" name="bc_settings[logo]" style="width: 600px" value="'.$option.'" />';
		echo '<p class="small-print">'.__('Uses sitename by default, if URL provided, will use that image instead.').'</p>';
		echo '<p class="small-print">'.__('For example, try ').get_template_directory_uri().'/img/site/logo.png</p>';
		echo '<p>&nbsp;</p>';
    }

    public function lobster_callback()
    {
		if(!isset($this->options['lobster'])) $this->options['lobster'] = false;
		$option = $this->options['lobster'];
        echo '<input type="text" id="lobster" name="bc_settings[lobster]" style="width: 600px" value="'.$option.'" />';
		echo '<p class="small-print">'.__('Default value is the WP tagline.').'</p>';
		echo '<p>&nbsp;</p>';
    }

    public function sub_callback()
    {
		if(!isset($this->options['sub'])) $this->options['sub'] = false;
		$option = $this->options['sub'];
        echo '<input type="text" id="sub" name="bc_settings[sub]" style="width: 600px" value="'.$option.'" />';
		echo '<p class="small-print">'.__('If empty, none will be shown.').'</p>';
		echo '<p>&nbsp;</p>';
    }

    public function footer_callback()
    {
		if(!isset($this->options['footer'])) $this->options['footer'] = false;
		$option = $this->options['footer'];
        echo '<input type="text" id="footer" name="bc_settings[footer]" style="width: 600px" value="'.$option.'" />';
		echo '<p class="small-print">'.__('If empty, URL to BrainControl.me will be shown.').'</p>';
		echo '<p>&nbsp;</p>';
    }

	public function background_callback()
    {
		$default_selected = false;
		$green_selected = false;
		$purple_selected = false;
		$red_selected = false;
		$yellow_selected = false;
		$blue_selected = false;
		if(!isset($this->options['background'])) $this->options['background'] = false;
		$option = $this->options['background'];
		if($option == 'default') $default_selected = 'selected="selected"';
		elseif($option == 'green') $green_selected = 'selected="selected"';
		elseif($option == 'purple') $purple_selected = 'selected="selected"';
		elseif($option == 'red') $red_selected = 'selected="selected"';
		elseif($option == 'yellow') $yellow_selected = 'selected="selected"';
		elseif($option == 'blue') $blue_selected = 'selected="selected"';
        echo '<select type="text" id="background" name="bc_settings[background]" style="width: 600px">';
			echo '<option value="default" '.$default_selected.'>'.__('Use Default Background Colour').'</option>';
			echo '<option value="green" '.$green_selected.'>'.__('Use Green Background Colours').'</option>';
			echo '<option value="purple" '.$purple_selected.'>'.__('Use Purple Background Colours').'</option>';
			echo '<option value="red" '.$red_selected.'>'.__('Use Red Background Colours').'</option>';
			echo '<option value="yellow" '.$yellow_selected.'>'.__('Use Yellow Background Colours').'</option>';
			echo '<option value="blue" '.$blue_selected.'>'.__('Use Blue Background Colours').'</option>';
		echo '</select>';
		echo '<p class="small-print">'.__('Optionally, you could just over-ride the CSS - this is just a starting point').'</p>';
    }

	public function parallax_callback()
    {
		$default_selected = false;
		$custom_selected = false;
		$none_selected = false;
		if(!isset($this->options['parallax'])) $this->options['parallax'] = false;
		$option = $this->options['parallax'];
		if($option == 'default') $default_selected = 'selected="selected"';
		elseif($option == 'custom') $custom_selected = 'selected="selected"';
		elseif($option == 'none') $none_selected = 'selected="selected"';
        echo '<select type="text" id="parallax" name="bc_settings[parallax]" style="width: 600px">';
			echo '<option value="default" '.$default_selected.'>'.__('Use Default Future-Retro Imagery').'</option>';
			echo '<option value="custom" '.$custom_selected.'>'.__('Use Custom Imagery (Add to Post / Page Meta)').'</option>';
			echo '<option value="none" '.$none_selected.'>'.__('Do not waste my time with Parallax effects!').'</option>';
		echo '</select>';
		echo '<p class="small-print">'.__('Get creative with this - but do not forget subtly is everything!').'</p>';
		echo '<p class="small-print">'.__('To add custom imagery simply select a featured image for the post or page.').'</p>';
    }

    public function url_callback()
    {
		if(!isset($this->options['url'])) $this->options['url'] = false;
		$option = $this->options['url'];
        echo '<input type="text" id="url" name="bc_settings[url]" style="width: 600px" value="'.$option.'" />';
		echo '<p class="small-print">'.__('Must start with http - such as http://bitcoin.org/en/download/').'</p>';
    }

	public function intro_callback()
    {
		if(!isset($this->options['intro'])) $this->options['intro'] = false;
		$option = $this->options['intro'];
        echo '<input type="text" id="intro" name="bc_settings[intro]" style="width: 600px" value="'.$option.'" />';
		echo '<p class="small-print">'.__('Default is "Stay Informed - Follow Updates"').'</p>';
		echo '<p>&nbsp;</p>';
    }

	public function twitter_callback()
    {
		if(!isset($this->options['twitter'])) $this->options['twitter'] = false;
		$option = $this->options['twitter'];
        echo '<input type="text" id="twitter" name="bc_settings[twitter]" style="width: 600px" value="'.$option.'" />';
		echo '<p class="small-print">'.__('Full URL, such as - http://twitter.com/braincontrolme - if empty, the ICON with not be shown.').'</p>';
		echo '<p>&nbsp;</p>';
    }

	public function facebook_callback()
    {
		if(!isset($this->options['facebook'])) $this->options['facebook'] = false;
		$option = $this->options['facebook'];
        echo '<input type="text" id="facebook" name="bc_settings[facebook]" style="width: 600px" value="'.$option.'" />';
		echo '<p class="small-print">'.__('Full URL, such as - https://www.facebook.com/pages/betanomicsasia/180009715481054 - if empty, the ICON with not be shown.').'</p>';
		echo '<p>&nbsp;</p>';
    }

	public function mailchimp_callback()
    {
		if(!isset($this->options['mailchimp'])) $this->options['mailchimp'] = false;
		$option = $this->options['mailchimp'];
        echo '<input type="text" id="mailchimp" name="bc_settings[mailchimp]" style="width: 600px" value="'.$option.'" />';
		echo '<p class="small-print">'.__('Full URL, such as - http://braincontrol.us3.list-manage.com/subscribe/post?u=b895175e50952d066a803be4c&id=05a1cccca8').'</p>';
		echo '<p class="small-print">'.__('If empty, the ICON with not be shown.').'</p>';
		echo '<p>&nbsp;</p>';
    }

}