<?php
    $servername = "remotemysql.com";
    $username = "fOopXz0KPv";
    $password = "EtqN8FLmdf";
    $port = 3306;
    
    //connection
    $conn = mysqli_connect($servername, $username, $passowrd);

    $json = file_get_contents('php://input');
    $obj = json_decode($json,true);
    $name = $obj['username'];
    $email = $obj['email'];

    $stmt = "Insert Into Trial (username, password)("+name+","+email+");";
    
    $do = mysqli_query($conn, $stmt);
    mysqli_close($conn);


?>