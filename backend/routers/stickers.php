<?php
function route($method,$urlList,$requestedData) {
    $link = mysqli_connect("127.0.0.1","root","","kanban");
    $token = substr(getallheaders()['Authorization'],7);
    $message = new stdClass();
    if($method == "POST"){

        switch ($urlList[1]) {
            case 'create':
                 $roomId = $requestedData->body->roomId;
                $posX = $requestedData->body->posX;
                 $posY = $requestedData->body->posY;
                $users = $link->query("SELECT user_id FROM tokens WHERE accsess_token='$token'")->fetch_assoc();
                if ($users){

                $room = $link->query("SELECT * FROM rooms WHERE room_id='$roomId'")->fetch_assoc();
                    if ($room){
                        $tokenInsertResult = $link->query("INSERT INTO `cards` (`room_id`,`posX`,`posY`,`title`,`text`) VALUES ('$roomId','$posX','$posY','Title','Wtite your text here')");
                        echo json_encode($tokenInsertResult);
                    }
                }
                break;
            
            case 'update':
                $roomId = $requestedData->body->roomId;
                $cardId = $requestedData->body->cardId;
                $posX = $requestedData->body->posX;
                 $posY = $requestedData->body->posY;
                $title = $requestedData->body->title;
                $text = $requestedData->body->text;
                $users = $link->query("SELECT user_id FROM tokens WHERE accsess_token='$token'")->fetch_assoc();
                if ($users){
                $room = $link->query("SELECT * FROM rooms WHERE room_id='$roomId'")->fetch_assoc();
                    if ($room){
                        if ($cardId){
                            if ($posX){
                                $tokenInsertResult = $link->query("UPDATE `cards` SET `posX` = '$posX' WHERE `cards`.`id` = '$cardId'");
                            }
                            if ($posY){
                                $tokenInsertResult = $link->query("UPDATE `cards` SET `posY` = '$posY' WHERE `cards`.`id` = '$cardId'");

                            }
                            if ($title){
                                $tokenInsertResult = $link->query("UPDATE `cards` SET `title` = '$title' WHERE `cards`.`id` = '$cardId'");

                            }
                            if ($text){
                                $tokenInsertResult = $link->query("UPDATE `cards` SET `text` = '$text' WHERE `cards`.`id` = '$cardId'");
                            }
                            $message->message = $tokenInsertResult;
                            echo json_encode($message);
                        } 

                    }
                }
                break;
            
            case 'delete':
            
                $roomId = $requestedData->body->roomId;
                $cardId = $requestedData->body->cardId;
                $users = $link->query("SELECT user_id FROM tokens WHERE accsess_token='$token'")->fetch_assoc();
                if ($users){
                $room = $link->query("SELECT * FROM rooms WHERE room_id='$roomId'")->fetch_assoc();
                    if ($room){
                        if ($cardId){
                            $tokenInsertResult = $link->query("DELETE FROM cards WHERE `cards`.`id` = '$cardId' AND `cards`.`room_id` = '$roomId' ");
                            echo json_encode($tokenInsertResult);
                        } 

                    }
                }
                break;
                
        }

    } elseif ($method == "GET") {
                $valid = $requestedData->parameters["valid"];
                $roomId = $requestedData->parameters["roomId"];
                $users = $link->query("SELECT * FROM tokens WHERE accsess_token='$token'")->fetch_assoc();

                if ($users && $valid){
                $rooms = $link->query("SELECT * FROM rooms WHERE `room_id`='$roomId'")->fetch_assoc();
                if ($rooms){
                        $stickers1 = [];
                        $stickers = $link->query("SELECT * FROM cards WHERE `room_id`='$roomId'");
                        while ($row = $stickers->fetch_assoc()) {
                            array_push($stickers1,$row);
                        }
                        $message->stickers = $stickers1;
                        echo json_encode($message);
                    } else {
                        $message->message = "Error: No rooms found";
                        echo json_encode($message);
                    }

                } else {
                    $message->message = "Error: Bad token";
                    echo json_encode($message);
                }

    } else {
        echo "Bad request";
    } 


}

?>