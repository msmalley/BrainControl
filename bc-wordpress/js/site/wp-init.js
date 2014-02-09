jQuery(document).ready(function(e){
	jQuery('.parallax').parallax();
	//bc_fake_truths();
	//bc_navigation();
	bc_mailchimp();
});
jQuery(window).load(function(e)
{
	braincontrol.init();
});

var active_navigation = false;

function bc_mailchimp()
{
	jQuery('#mailchimp-popup').on('click', function(e){
		e.preventDefault();
		var url = $(this).attr('data-url');
		mb_alert(false, false, 'Subscribe to Email Notifications', false, false, 'mailchimp');
		$('#mc-embedded-subscribe-form').attr('action', url);
	});
}

/*

INTRODUCE THIS FUNCTIONALITY IN NEXT VERSION
function bc_navigation()
{
	var used = false;
	if(typeof history.pushState != 'undefined')
	{
		jQuery('a#logo').on('click', function(e){
			e.preventDefault();
			jQuery('nav.navbar li.demo a').trigger('click');
			history.pushState(window.location.href, false, mb_env_data('mb-url'));
		})
		window.onpopstate = function(e)
		{
			if(used && active_navigation != true)
			{
				var slugs = window.location.href.split('/');
				jQuery('nav.navbar li').each(function(i){
					if(slugs[slugs.length - 1] && jQuery(this).hasClass(slugs[slugs.length - 1]))
					{
						jQuery('nav.navbar li').removeClass('active');
						jQuery(this).addClass('active');
						jQuery(this).find('a').addClass('loading');
						bc_animation(slugs[slugs.length - 1]);
					}
				});
			}
        };
	}
	jQuery('nav.navbar li a').on('click', function(e){
		var slug = $(this).attr('data-slug');
		if(active_navigation != true && !jQuery(this).parent().hasClass('active'))
		{
			active_navigation = true;
			if(typeof history.pushState != 'undefined')
			{
				e.preventDefault();

				jQuery(this).addClass('loading');
				jQuery('nav.navbar li').removeClass('active');
				jQuery(this).parent().addClass('active');
				history.pushState(window.location.href, false, mb_env_data('mb-url')+slug);

				bc_animation(slug);
				used = true;
			}
		}
		else
		{
			if(typeof history.pushState != 'undefined')
			{
				e.preventDefault();
			}
		}
	});
}

function bc_animation(section)
{
	var hand_right = jQuery('#hand').css('right');
	var strip_top = jQuery('#strip-wrapper').css('top');
	jQuery('#parallax-layer-01').animate({'opacity':0}, 800, function(e){
		jQuery('#parallax-layer-01').attr('class', 'parallax');
		jQuery('#parallax-layer-01').addClass(section);
		jQuery('#parallax-layer-01').animate({'opacity':1}, 800, function(e){

		});
	});
	jQuery(window).resize(function(e){
		$('#hand').attr('style','');
		$('#strip-wrapper').attr('style','');
	});
	jQuery('.hand-holder.active, #braincontrol, #bc-standalone').animate({'opacity':0}, 100, function(e){
		jQuery('.hand-holder').css({'opacity':0});
		if(section == 'demo')
		{
			braincontrol.slide(false, 'page-markets');
		}
		else
		{
			braincontrol.slide('down', 'step-'+section);
		}
	});
	jQuery('#hand').animate({'right':'150%'}, 400, function()
	{
		jQuery('#hand').css({'right':'-150%'});
		jQuery('#main-content').css({'overflow':'hidden'});
		jQuery('#strip-wrapper').animate({'top':'-100%'}, 600, function()
		{
			jQuery('#strip-wrapper').css({'top':'200%'});
			jQuery('#main-content').css({'overflow':'visible'});

			jQuery('.spoke-wrapper').removeClass('active');
			jQuery('#'+section+'-tab').addClass('active');

			jQuery('.hand-holder').css({'opacity':0});
			jQuery('.hand-holder').removeClass('active');
			jQuery('#'+section+'-image').addClass('active');

			jQuery('#hand').animate({'right':hand_right}, 400, function()
			{

				jQuery('.hand-holder.active, #braincontrol, #bc-standalone').animate({'opacity':1}, 200);
				jQuery('#strip-wrapper').animate({'top':strip_top}, 600, function()
				{
					active_navigation = false;
					jQuery('nav.navbar li a').removeClass('loading');
				});
			});
		})
	});
}

function bc_fake_truths()
{
	jQuery('.fake-truth').on('click', function(e){
		if(typeof history.pushState != 'undefined')
		{
			e.preventDefault();
			jQuery('nav.navbar li.about a').trigger('click');
		}
	});
	jQuery('.fake-start').on('click', function(e){
		if(typeof history.pushState != 'undefined')
		{
			e.preventDefault();
			jQuery('nav.navbar li.demo a').trigger('click');
		}
	});
	jQuery('.fake-tech').on('click', function(e){
		if(typeof history.pushState != 'undefined')
		{
			e.preventDefault();
			jQuery('nav.navbar li.tech a').trigger('click');
		}
	});
}
*/
