<?php

session_start();

require_once "load_data.php";
if (!isset($_SESSION["visited-products"])){
    $_SESSION["visited-products"] = array();
}

if (isset($_GET["search-input"])){
   $input = htmlentities(trim($_GET["search-input"]));
    if (empty($input)){
        echo "";
        die();
    }

    $inputs = array();

    if (strpos($input , " ") !== false){
        $inputs = explode(" " , $input);
    }else{
        $inputs[] = $input;
    }

    $items_found = array();

    $limit = 5;

    if (isset($_SESSION["visited-products"])){
           uasort($_SESSION["visited-products"],
               function ($a , $b){
                   return $a["visited_times"] < $b["visited_times"];
             }
            );
           foreach ($_SESSION["visited-products"] as $this_id=>$product){

               $name = $product["name"];

               $name_strip_symbols = preg_replace('/[^\p{L}\p{N}\s]/u', '', $name);

               foreach ($inputs as $key_word){
                   $key_word_strip_symbols = preg_replace('/[^\p{L}\p{N}\s]/u', '', $key_word);

                   if (stristr($name_strip_symbols , $key_word_strip_symbols) !== false){
                        $limit--;
                        $items_found[] =  ["name" => $name , "id" => $this_id];
                    }
               }
               if ($limit == 0){
                 break;
               }
           }
    }
    $limit = 5;

    shuffle($makeup_items);
    foreach ($makeup_items as $makeup_item) {
        $name = $makeup_item["name"];
        $ord_id = $makeup_item["id"];
        $name_strip_symbols = preg_replace('/[^\p{L}\p{N}\s]/u', '', $name);

        foreach ($inputs as $key_word) {
            $key_word_strip_symbols = preg_replace('/[^\p{L}\p{N}\s]/u', '', $key_word);

            if (stristr($name_strip_symbols,$key_word_strip_symbols) !== false && !isset($_SESSION["visited-products"][$ord_id])){
                $limit--;
                $items_found[] = ["name" => $name , "id" => $ord_id];
            }

            if ($limit == 0){
                break 2;
            }

        }

    }

    echo json_encode($items_found , JSON_UNESCAPED_SLASHES);
}

if (isset($_GET["info-input"])){
    $id = htmlentities($_GET["info-input"]);

    if (empty($id)){
        echo "";
        die();
    }



    $info_output = array();

    foreach ($makeup_items as $makeup_item) {
        if ($id == $makeup_item["id"]){

            $id = htmlentities($makeup_item["id"]);
            $category = htmlentities($makeup_item["category"]);
            $brand = htmlentities($makeup_item["brand"]);
            $name = htmlentities($makeup_item["name"]);
            $price = htmlentities($makeup_item["price"]);
            $image_link = htmlentities($makeup_item["image_link"]);
            $description = htmlentities($makeup_item["description"]);
            $product_colors = $makeup_item["product_colors"];



            $info_output = [
                "id" => $id ,
                "name" => $name,
                "brand"=> $brand ,
                "type" => $category ,
                "price"=>$price ,
                "description"=>$description ,
                "imageLink"=>$image_link ,
                "productColors" => $product_colors
            ];

            if (!isset($_SESSION["visited-products"][$id])){
                $_SESSION["visited-products"][$id] = ["name" => $name , "visited_times" => 1];
            }else{
                $_SESSION["visited-products"][$id]["visited_times"] = &$_SESSION["visited-products"][$id]["visited_times"] + 1;
            }

            break;
        }else{
            $info_output = array();
        }

    }
   echo json_encode($info_output , JSON_UNESCAPED_SLASHES);

}

if (isset($_GET["load-advanced-search"])){
    $advanced_search_responce = array();
    foreach ($brands_list as &$brand){
       $brand = trim((preg_replace('/\s\s+/', ' ', $brand)));
    }

    foreach ($product_types_list as &$product_type){
        $product_type = trim((preg_replace('/\s\s+/', ' ', $product_type)));
    }
    $advanced_search_responce["brands"] = $brands_list;
    $advanced_search_responce["productTypes"] = $product_types_list;
    echo json_encode($advanced_search_responce , JSON_UNESCAPED_SLASHES);
}

