<?php
    function route($method,$urlList,$requestedData){
        $link = mysqli_connect("127.0.0.1","root","","kanban");
        switch ($method) {
            case 'GET':

                $token = substr(getallheaders()['Authorization'],7);
                $message = new stdClass();
                $users = $link->query("SELECT user_id FROM tokens WHERE accsess_token='$token'")->fetch_assoc();
                $userId = $users["user_id"];
                $user = $link->query("SELECT id,username FROM users WHERE id='$userId'")->fetch_assoc();
                    if(is_null($users)){

                    }else {
                        echo json_encode($user);
                    }   



                break;
            
            case 'POST':
                switch ($urlList[1]) {
                    case 'register':
                $message = new stdClass();
                $username = $requestedData->body->username;
                $users = $link->query("SELECT * FROM users WHERE username='$username'")->fetch_assoc();

                if (is_null($users) || is_null($requestedData->body)){
                    $password = hash('sha1', $requestedData->password);
                    $password = $requestedData->body->password;
                    $userInsertResult = $link->query("INSERT INTO users(username,password) VALUES('$username','$password')");

                    if(!$userInsertResult){
                        $message->message = "Error: Internal db error";
                        echo json_encode($message);
                    }else {
                        $message->message = "User: '$username' succsessefuly created";
                        echo json_encode($message);
                    }   

                } else {
                    $message->message = "Error: '$username' already exists";
                    echo json_encode($message);
                }

                break;
                
                case 'logout':

                    $token = substr(getallheaders()['Authorization'],7);
                    $users = $link->query("SELECT user_id FROM tokens WHERE accsess_token='$token'")->fetch_assoc();
                    $userId = $users["user_id"];
                    
                    if(is_null($users)){

                    }else {
                        $result = $link->query("DELETE FROM `tokens` WHERE `tokens`.`user_id` = '$userId'");
                        echo json_encode($result);
                    }   
                    

                        
                break;


        }
    }
    }

?>