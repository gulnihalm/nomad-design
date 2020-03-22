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

//Check if email exists in db
$emailSQL = "SELECT * FROM UserTable WHERE mainemail='$email'";
$emailCheck = mysqli_fetch_array(mysqli_query($con,$emailSQL));

if(isset($emailCheck)){ //email exists
    $passwordSQL = "SELECT * FROM UserTable WHERE mainemail='$email' AND password='$password'";
    $passCheck = mysqli_fetch_array(mysqli_query($con,$passwordSQL));
    
    if( isset($passCheck) ){ //both email and password exist, login
        $currSQL = mysqli_fetch_array(mysqli_query($con, "SELECT * FROM UserTable WHERE mainemail='$email'"));
        $name = $currSQL['name'];
        $surname = $currSQL['surname'];
        $guid = $currSQL['guid'];
        $pic = $currSQL['picture'];
        $currFBID = $currSQL['facebookid'];
        $currGID  = $currSQL['googleid'];
        $currTWID = $currSQL['twitterid'];
        $currFBMAIL = $currSQL['facebookemail'];
        $currGMAIL  = $currSQL['googleemail'];
        $currTWMAIL = $currSQL['twitteremail'];
        $fbEntrance = FALSE;
        $googleEntrance = FALSE;
        $twitterEntrance = FALSE;
        if(!empty($currFBID)){ $fbEntrance = TRUE; }
        if(!empty($currGID)){ $googleEntrance = TRUE; }
        if(!empty($currTWID)){ $twitterEntrance = TRUE; }
        echo json_encode([
            "result" => 1, "name" => $name, "surname" => $surname, "guid" => $guid, "pic" => $pic, 
            "facebookid" => $currFBID, "googleid" => $currGID, "twitterid" => $currTWID,
            "facebookemail" => $currFBMAIL, "googleemail" => $currGMAIL, "twitteremail" => $currTWMAIL, 
            "fbEntrance" => $fbEntrance, "googleEntrance" => $googleEntrance, "twitterEntrance" => $twitterEntrance, 
        ]);
    }
    else{ //email exists but wrong password
        echo json_encode(["result" => -2]);
    }
}
else{
    //Try Again
    echo json_encode(["result" => -1]);
}

mysqli_close($con);
?>