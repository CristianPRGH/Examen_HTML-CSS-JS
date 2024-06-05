<?php
    $connection = new mysqli("localhost", "root", "", "examen_html_css_js");
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }
?>