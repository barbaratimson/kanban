<?php

function route($method,$urlList,$requestedData) {
    $message = new stdClass();
    if($method == "POST"){
        $link = mysqli_connect("127.0.0.1","root","","kanban");
        switch ($urlList[1]) {
            case 'login':
                $username = $requestedData->body->username;
                $password = $requestedData->body->password;
                $users = $link->query("SELECT id FROM users WHERE username='$username' AND password='$password'")->fetch_assoc();
                $userId = $users["id"];
                if ($users){
                    $token = bin2hex(random_bytes(16));
                    $tokenInsertResult = $link->query("INSERT INTO tokens(user_id,accsess_token) VALUES('$userId','$token')");
                    if (!$tokenInsertResult){
                        echo $message->message = $link->error;
                    } else {
                        $message->token = $token;
                        echo json_encode($message);
                    }

                } else {
                    echo $message->message = "Error: Wrong username or password";
                }

                break;
            
            case 'logout':

                break;  

            default:
                # code...
                break;
        } 
    } else {
        echo "Bad request";
    } 


}

?>