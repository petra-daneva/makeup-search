//                                  --- HTML components ---
var search = document.getElementById("search");
var searchBar = document.getElementById("search-bar");
var searchSuggestions = document.getElementById("search-suggestions");
var content = document.getElementById("content");
var advancedSearch = document.getElementById("advanced-search");

//                                  --- Delay Requests ---
// Code explained simply here:
//https://schier.co/blog/2014/12/08/wait-for-user-to-stop-typing-using-javascript.html
var timeout = null;
function sendInput(input) {

    //validate input string
    if (input.length >= 25){
        searchSuggestions.innerHTML = "Input length is too long!";
        return;
    }
    if (input.length === 0){
        searchSuggestions.innerHTML = "";
        searchSuggestions.style.visibility = "hidden";
        return;
    }


    clearTimeout(timeout);
    searchSuggestions.innerHTML = "Searching for " + input + " . . . Please wait.";
    timeout = setTimeout(function () {showSuggestions(input); }, 500);
}

//                             --- Show suggestions from the server ---
function showSuggestions(input){

    //restart suggestions every time the function is triggered
    searchSuggestions.innerHTML = "";
    searchSuggestions.style.visibility = "visible";

    //send request
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4){
            if (this.status == 200){
                var itemsFound = JSON.parse(this.responseText);
                    if (itemsFound.length == 0){
                    searchSuggestions.innerHTML = "No matches found!";
                    return;
                }

                var ul = document.createElement("ul");

                for (var  i = 0 ; i < itemsFound.length ; i++){
                    var li = document.createElement("li");
                    var a = document.createElement("a");
                    var item = itemsFound[i]["name"];
                    a.innerHTML = item;
                    a.id = itemsFound[i]["id"];
                    a.href = "javascript:void(0)";
                    li.appendChild(a);
                    ul.appendChild(li);

                }


                searchSuggestions.appendChild(ul);
                // ------ Refresh div, without re-loading the page -------
                searchSuggestions.getElementsByTagName("a");
                for(var i = 0; i < searchSuggestions.childNodes[0].childElementCount; i++) {
                   var li = searchSuggestions.childNodes[0].childNodes[i];
                   var a = li.childNodes[0];
                   a.setAttribute("onclick" , "fillContent(eval((" + a.id +")))");
                }


            }else{
                window.alert("Request failed. Reasons: " + this.status + " - " + this.statusText);
            }
        }


    };

    xhr.open("GET" , "server.php?search-input="+input , true);
    xhr.send();


}

//                                        --- Show item -----
function fillContent(itemID) {
    searchSuggestions.childNodes = undefined;
    searchSuggestions.style.visibility = "hidden";
    searchBar.value = "";
    content.innerHTML = "";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4){
            if (this.status == 200){
                content.innerHTML = "";
                var item = JSON.parse(this.responseText);

                   var heading = document.createElement("h1");
                   var picture = document.createElement("img");
                   var description = document.createElement("p");
                   var tableInfo = document.createElement("table"); // type , price , colors
                   var type = document.createElement("td");
                   var price = document.createElement("td");
                   var tableColors = document.createElement("table");

                       heading.innerHTML = item.name;
                       picture.src = item.imageLink;
                       description.innerHTML = item.description;
                       type.innerHTML = "Product type:" + item.type;
                       type.appendChild(tableInfo);
                       price.innerHTML = "Product price: " + item.price + "$";
                        price.appendChild(tableInfo);

                    for (var k = 0 ; k < item.productColors.length ; k++){
                        var colorInfo = document.createElement("tr");
                        var colorName = document.createElement("td");
                        var colorHex = document.createElement("td");

                        var colorSample = document.createElement("div");
                        colorName.innerHTML = item.productColors[k].colour_name;
                        colorHex.appendChild(colorSample);

                        colorSample.style.width = "25px";
                        colorSample.style.height = "25px";
                        colorSample.style.borderRadius = "50%";
                        colorSample.style.backgroundColor = item.productColors[k].hex_value;

                        colorInfo.appendChild(colorHex);
                        colorInfo.appendChild(colorName);
                        tableColors.appendChild(colorInfo);
                    }

                content.appendChild(heading);
                content.appendChild(picture);

                content.appendChild(tableColors);
                content.appendChild(description);
                content.appendChild(tableInfo);
                tableInfo.appendChild(info);
                info.appendChild(type);
                info.appendChild(price);
            }else {
                alert("Something went wrong. Reasons: " + this.status + " - " + this.statusText);
            }
        }
    };
    xhr.open("get" , "server.php?info-input="+itemID , true);
    xhr.send();
}

//                                      --- Show advanced search menu ---
function loadAdvancedSearch() {
    advancedSearch.style.visibility = "visible";
    content.innerHTML = "";
    content.appendChild(advancedSearch);
    searchBar.style.visibility = "hidden";
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4){
            if (this.status == 200){
                var responce = JSON.parse(this.responseText);
                var allBrands = responce.brands;
                var allTypes = responce.productTypes;

                var brands = document.createElement("h3");

                brands.innerHTML = "Brands available";
                advancedSearch.appendChild(brands);
                for (var i = 0 ; i < allBrands.length ; i++){
                  var new_input = document.createElement("input");
                  if (i%6 == 0){
                      advancedSearch.innerHTML += "<br>" ;
                  }
                  advancedSearch.innerHTML += ("&nbsp" + allBrands[i].toUpperCase()) ;
                  new_input.type = "checkbox";
                  new_input.name = allBrands[i];
                  advancedSearch.appendChild(new_input);
            }



                var productTypes = document.createElement("h3");
                productTypes.innerHTML = "Product types";
                advancedSearch.appendChild(productTypes);
                for (var i = 0 ; i < allTypes.length ; i++){
                    var new_input = document.createElement("input");
                    advancedSearch.innerHTML += allTypes[i];
                    new_input.type = "checkbox";
                    new_input.name = allTypes[i];
                    advancedSearch.appendChild(new_input);
                }

              var submit = document.createElement("input");
                submit.type = "submit";
                submit.id = "send-advanced-search";
                submit.value = "Search";
                advancedSearch.appendChild(submit);
            }else {
                alert("Something went wrong");
            }
        }
    };

    xhr.open("get" , "server.php?load-advanced-search=" + true , true);
    xhr.send();


}

//                                      --- Gallery ---

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    var captionText = document.getElementById("caption");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    captionText.innerHTML = dots[slideIndex-1].alt;
}

