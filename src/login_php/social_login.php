<?php

include 'DBConfig.php';

// Creating connection.
$con = mysqli_connect($HostName,$HostUser,$HostPass,$DatabaseName,$portNum);
// Getting the received JSON into $json variable.
$json = file_get_contents('php://input');
// decoding the received JSON and store into $obj variable.
$obj = json_decode($json,true);
 
// Populate user name and password from JSON $obj array
$name = $obj['name'];
$surname = $obj['surname'];
$email = $obj['email'];
$id = $obj['id'];
$choice = $obj['choice'];
$guid = $obj['guid'];
$pic = $obj['pic'];

//determine what social media option has been chosen
$socialType = '';
if (strpos($choice, '0') !== false) { //fb
    $socialType = 'facebookid';
    $socialMail = 'facebookemail';
    $otherMail1 = 'googleemail';
    $otherMail2 = 'twitteremail';
}
else if (strpos($choice, '1') !== false) { //google
    $socialType = 'googleid';
    $socialMail = 'googleemail';
    $otherMail1 = 'facebookemail';
    $otherMail2 = 'twitteremail';
}
else if (strpos($choice, '2') !== false) { //twitter
    $socialType = 'twitterid';
    $socialMail = 'twitteremail';
    $otherMail1 = 'facebookemail';
    $otherMail2 = 'googleemail';
}

//id check.
$idSQL = "SELECT * FROM UserTable WHERE $socialType='$id'";
$idCheck = mysqli_fetch_array(mysqli_query($con,$idSQL));

if(isset($idCheck)){ //id exists, no insertion, just login.
    $currGuid = $idCheck['guid'];
    $currName = $idCheck['name'];
    $currSurname = $idCheck['surname'];
    $currMail = $idCheck['mainemail'];
    $currPass = $idCheck['password'];
    $currFBID = $idCheck['facebookid'];
    $currGID  = $idCheck['googleid'];
    $currTWID = $idCheck['twitterid'];
    $currFBMAIL = $idCheck['facebookemail'];
    $currGMAIL  = $idCheck['googleemail'];
    $currTWMAIL = $idCheck['twitteremail'];
    $fbEntrance = FALSE;
    $googleEntrance = FALSE;
    $twitterEntrance = FALSE;
    if(!empty($currFBID)){ $fbEntrance = TRUE; }
    if(!empty($currGID)){ $googleEntrance = TRUE; }
    if(!empty($currTWID)){ $twitterEntrance = TRUE; }
    echo json_encode([
        "result" => 1, "guid" => $currGuid, 
        "name" => $currName, "surname" => $currSurname, "email" => $currMail, "password" => $currPass,
        "facebookid" => $currFBID, "googleid" => $currGID, "twitterid" => $currTWID,
        "facebookemail" => $currFBMAIL, "googleemail" => $currGMAIL, "twitteremail" => $currTWMAIL, 
        "fbEntrance" => $fbEntrance, "googleEntrance" => $googleEntrance, "twitterEntrance" => $twitterEntrance, 
    ]);
    mysqli_close($con);
    exit(0);
}
else{ //this is a new id, so we might insert, but email check for sync first
    $syncSQL = "SELECT * FROM UserTable WHERE $otherMail1='$email' OR $otherMail2='$email'";
    $syncCheck = mysqli_fetch_array(mysqli_query($con,$syncSQL));

    if(isset($syncCheck)){ //email already exists, so no insertion, sync needed, notify user
        echo json_encode([ "result" => -2 ]);
        mysqli_close($con);
        exit(0);
    }
    else{ //email is new, id is new, so insert new row.
        $Sql_Query = "INSERT INTO UserTable (name, surname, mainemail, $socialMail, guid, picture, $socialType) 
        VALUES ('$name','$surname','$email','$email','$guid','$pic','$id' )";
        if(mysqli_query($con,$Sql_Query)){
            //User Registered Successfully
            echo json_encode([ "result" => 0 ]);
            mysqli_close($con);
            exit(0);
        }
    }
}

//Try Again
$error = mysqli_error($con);
echo json_encode([ "result" => -1, "error" => $error ]);
mysqli_close($con);
exit(0);
?>