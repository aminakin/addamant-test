<?php

include 'SimpleXLSX.php';
$tables = array();

foreach ($_FILES["files"]["error"] as $key => $error) {
    if ($error == UPLOAD_ERR_OK) {
        $tmp_name = $_FILES["files"]["tmp_name"][$key];
        $name = basename($_FILES["files"]["name"][$key]);
        move_uploaded_file($tmp_name, "files/$name");
        if ( $xlsx = SimpleXLSX::parse('files/'.$name) ) {
         array_push($tables, $xlsx->toHTML());
        } else {
         echo SimpleXLSX::parseError();
        }
    }
}

echo json_encode($tables);

?>
