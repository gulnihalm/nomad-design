<?php

include 'DBConfig.php';

// Creating connection.
$con = mysqli_connect($HostName,$HostUser,$HostPass,$DatabaseName,$portNum);
// Getting the received JSON into $json variable.
$json = file_get_contents('php://input');
// decoding the received JSON and store into $obj variable.
$obj = json_decode($json,true);
 
// Populate email and password from JSON $obj array
$email = $obj['email'];
$password = $obj['password'];
$guid = $obj['guid'];

$Sql_Query = "UPDATE UserTable SET password = '$password'";

if(!empty($email)){
    //Checking if email already exists or not using SQL query.
    $emailSQL = "SELECT * FROM UserTable WHERE mainemail='$email'";
    $emailCheck = mysqli_fetch_array(mysqli_query($con,$emailSQL)); //there is a problem here
    if(isset($emailCheck)){ 
        echo json_encode(["result" => -2]);
        mysqli_close($con);
        exit(0);
    }
    else {
        $Sql_Query .= ", mainemail = '$email'";
    }
}

$Sql_Query .= " WHERE guid = '$guid'";

if(mysqli_query($con,$Sql_Query)){
    //User Registered Successfully
    echo json_encode([ "result" => 1, "email" => $email, "password" => $password ]);
}
else{
    //Try Again
    $error = mysqli_error($con);
    echo json_encode([ "result" => -1, "error" => $error ]);
}

mysqli_close($con);
?>