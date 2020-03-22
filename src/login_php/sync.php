<?php 

include 'DBConfig.php';

// Creating connection.
$con = mysqli_connect($HostName,$HostUser,$HostPass,$DatabaseName,$portNum);
// Getting the received JSON into $json variable.
$json = file_get_contents('php://input');
// decoding the received JSON and store into $obj variable.
$obj = json_decode($json,true);
 
// Populate user name and password from JSON $obj array
$id = $obj['id'];
$mail = $obj['mail'];
$choice = $obj['choice'];
$guid = $obj['guid'];

//determine what social media option has been chosen
$socialType = '';
if (strpos($choice, '0') !== false) { //fb
    $socialType = 'facebookid';
    $socialMail = 'facebookemail';
}
else if (strpos($choice, '1') !== false) { //google
    $socialType = 'googleid';
    $socialMail = 'googleemail';
}
else if (strpos($choice, '2') !== false) { //twitter
    $socialType = 'twitterid';
    $socialMail = 'twitteremail';
}

try{
    //check if id exists in db
    $idSQL = "SELECT guid FROM UserTable WHERE $socialType='$id'";
    $idCheck = mysqli_fetch_array(mysqli_query($con,$idSQL));
    if(isset($idCheck)){
        echo json_encode(["result" => -2]);
    }
    else{
        $update = mysqli_query($con, "UPDATE UserTable SET $socialType = '$id', $socialMail = '$mail' WHERE guid = '$guid'");
        echo json_encode(["result" => 1]);
    }
}
catch( Exception $error ) {
    echo json_encode(["result" => -1, "error" => $error]);
}
mysqli_close($con);
?>