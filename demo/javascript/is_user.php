<?php
	require 'config.php';
	
	$query = mysql_query("SELECT user FROM blog_user WHERE user='{$_POST['user']}'") or die('SQL 错误！');
	
	if (mysql_fetch_array($query, MYSQL_ASSOC)) {
		sleep(3);
		echo 1 ;
	} else {
		echo 'true';
	}
	
	mysql_close();
?>