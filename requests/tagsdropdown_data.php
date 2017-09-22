<?php

class r {
	var $value; 
	var $text;
	var $selected;

	function __construct($v, $t, $s) {
		$this->value = $v;
		$this->text = $t;
		$this->selected = $s;
	}
}


echo json_encode([
	new r(1,'eins',false),
	new r(2,'zwei',false),
	new r(3,'drei',true)
]);