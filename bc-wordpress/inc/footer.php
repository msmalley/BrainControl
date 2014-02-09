<?php

$footer = bc_option('footer');
if(!$footer) $footer = 'Another <a href="http://braincontrol.me">BrainControl</a> Portal';

?>

<div id="footer">

	<p><?php echo $footer; ?></p>

</div>