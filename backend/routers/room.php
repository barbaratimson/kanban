<?php

function route($method,$urlList,$requestedData) {
    $link = mysqli_connect("127.0.0.1","root","","kanban");
    $token = substr(getallheaders()['Authorization'],7);
    $message = new stdClass();
    if($method == "POST"){
        switch ($urlList[1]) {
            case 'create':
                $users = $link->query("SELECT user_id FROM tokens WHERE accsess_token='$token'")->fetch_assoc();
                $userId = $users["user_id"];
                if ($users){
                $roomId = $requestedData->body->roomId;
                $password = $requestedData->body->password;
                $rooms = $link->query("SELECT * FROM rooms WHERE owner_user_id='$userId'")->fetch_assoc();
                if (is_null($rooms)){
                    $tokenInsertResult = $link->query("INSERT INTO `rooms` (`owner_user_id`,`room_id`,`password`) VALUES ('$userId', '$roomId','$password')");
                    if (!$tokenInsertResult){
                        $message->message = $link->error;
                    } else {
                        $message->roomId = $roomId;
                        echo json_encode($message);
                    }

                } else {
                    $message->message = "Error: Room exists";
                    echo json_encode($message);
                }
            } else {
                $message->message = "Bad token";
                echo json_encode($message);
            }
                break;
            
                case 'change':
                    $password = $requestedData->body->password;
                    $users = $link->query("SELECT user_id FROM tokens WHERE accsess_token='$token'")->fetch_assoc();
                    $userId = $users["user_id"];
                    if ($users){
                    $rooms = $link->query("SELECT * FROM rooms WHERE owner_user_id='$userId'")->fetch_assoc();
                    $roomId = $rooms["id"];
                    if (!$rooms){

                    } else {
                        $updateResult = $link->query("UPDATE `rooms` SET `password` = '$password' WHERE `rooms`.`id` = '$roomId'");
                        $message->result = $updateResult;
                        $message->password =     $password  ;
                        echo json_encode($message);
                    }
                } else {
                    $message->message = "Bad token";
                    echo json_encode($message);
                }
                    break;

            default:
                # code...
                break;
        } 
    } elseif ($method == "GET") {

        switch ($urlList[1]) {
            case 'get':

                $users = $link->query("SELECT * FROM tokens WHERE accsess_token='$token'")->fetch_assoc();
                $userId = $users["user_id"];
                if ($users){
                $rooms = $link->query("SELECT * FROM rooms WHERE `owner_user_id`='$userId'")->fetch_assoc();
                if ($rooms){
                        $message->roomId = $rooms["room_id"];
                        echo json_encode($message);
                    } else {
                    }

                } else {

                }
                break;

            case 'connect':{
                $roomId = $requestedData->parameters["roomId"];
                $password = $requestedData->parameters["password"];
                $users = $link->query("SELECT * FROM tokens WHERE accsess_token='$token'")->fetch_assoc();
                $userId = $users["user_id"];
                if ($users){
                $rooms = $link->query("SELECT * FROM rooms WHERE `room_id`='$roomId' AND `password`='$password'")->fetch_assoc();
                if ($rooms){
                        $message->roomId = $rooms["room_id"];
                        $message->valid = true;
                        echo json_encode($message);
                    } else {
                        $message->roomId = $roomId;
                        $message->valid = false;
                        echo json_encode($message);
                    }

                } else {
                    $message->message = "Error: Room exists";
                    echo json_encode($message);
                }
            }
                break;
            case 'owner':
                $roomId = $requestedData->parameters["roomId"];
                $users = $link->query("SELECT * FROM tokens WHERE accsess_token='$token'")->fetch_assoc();
                if ($users){
                $rooms = $link->query("SELECT * FROM rooms WHERE `room_id`='$roomId'")->fetch_assoc();
                $ownerId = $rooms["owner_user_id"];
                $username = $link->query("SELECT username FROM users WHERE id='$ownerId'")->fetch_assoc();
                if ($rooms){;
                        echo json_encode($username);
                    } else {
                    }

                } else {

                }
                break;
            }
    } else {
        echo "Bad request";
    } 


}

?>