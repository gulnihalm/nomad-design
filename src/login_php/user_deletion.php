<?php 

include 'DBConfig.php';

// Creating connection.
$con = mysqli_connect($HostName,$HostUser,$HostPass,$DatabaseName,$portNum);
// Getting the received JSON into $json variable.
$json = file_get_contents('php://input');
// decoding the received JSON and store into $obj variable.
$obj = json_decode($json,true);
 
// guid
$guid = $obj['guid'];

try{
    $deleteSQL = mysqli_query($con,"DELETE FROM UserTable WHERE guid='$guid'");
    echo json_encode(["result" => 1]);
   
}
catch( Exception $error ) {
    echo json_encode(["result" => -1, "error" => $error]);
}
mysqli_close($con);
?>