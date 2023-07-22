<?php
    header("Access-Control-Allow-Origin:*");   
    header('Access-Control-Allow-Headers:*');  
    header("Content-type: application/json"); 
    function getMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }

    function getData($method){
        $data = new stdClass();
        if ($method != "GET") {
            $data->body = json_decode(file_get_contents('php://input'));
        } 
        $data->parameters = [];
        $dataGet = $_GET;
        foreach ($dataGet as $key => $value){
            if ($key != "q"){
                $data->parameters[$key]=$value;
            }
        }
        return $data;
}

    // echo json_encode(getData(getMethod()));

    $url = isset($_GET['q']) ? $_GET['q'] : '';
    $url = rtrim($url,'/');
    $urlList = explode('/',$url);

    $router = $urlList[0];
    $requestedData = getData(getMethod()); 
    $method = getMethod();  

    if(file_exists(realpath(dirname(__FILE__)).'/routers/' . $router . '.php')){
        include_once 'routers/' . $router . '.php';
        route($method,$urlList,$requestedData);
    } else {
        echo "404";
    }

?>  

