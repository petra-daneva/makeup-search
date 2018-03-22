<?php
set_time_limit(0);
define("API_LINK" , "http://makeup-api.herokuapp.com/api/v1/products.json");



$makeup_items_json = file_get_contents("makeup.json");
if (empty($makeup_items_json)){
   $api_json = file_get_contents(API_LINK);
   file_put_contents("makeup.json" , $api_json);
}
$makeup_items = json_decode($makeup_items_json , true);

$brands_list = file("brands.txt");
$product_types_list = file("product_types.txt");



function getBrandNames(){
    $link = "http://makeup-api.herokuapp.com/api/v1/products.json?brand";


}

function getFilteredInfo($brand , $product_type){
    if ($brand == null && $product_type == null){
        return null;
    }elseif ($brand == null){
        $get_product_type = "product_type=$product_type";
    }elseif ($product_type == null){
        $get_brand = "brand=$brand";
    }else{
        $get_brand = "brand=$brand";
        $get_product_type = "&product_type=$product_type";

    }
    $link = "http://makeup-api.herokuapp.com/api/v1/products.json?$get_brand"."$get_product_type";
    $brand_items = json_decode(file_get_contents($link) , true);
    return $brand_items;
}