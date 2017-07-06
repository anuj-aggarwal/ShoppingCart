"use strict";

var itemsList;  // Bootstrap row containing all Item Cards
var catalog = [];   // Catalog as an Array of objects
var cartItems = {}; // Cart as an object with Data-ID:quantity pairs
var brands = ["Samsung", "LG", "Sony"];
var excludeSelected;
var onlyCOD;

// Window.OnLoad
$(function () {
    itemsList = $("#items");
    excludeSelected = $('#excludeSelected');
    onlyCOD = $('#onlycod');

    fetchCart();
    fetchCatalog(catalog);

    $(document).on('change', '#sort-select', function(){showCatalog(catalog)});
    $('#price-filter-button').on('click', function(){showCatalog(catalog);});
    $('#brands input').on('click', function(){showCatalog(catalog)});
    excludeSelected.on('click', function(){
        showCatalog(catalog);
    });
    onlyCOD.on('click', function(){
        showCatalog(catalog);
    });

});

// Add the Item in event.target's Card to the catalog
function addToCart(event) {
    fetchCart();
    var idToAdd = $(event.target).closest("[data-id]").attr("data-id");
    if (cartItems[idToAdd]) {   // If Item already in Cart
        ++cartItems[idToAdd];   // Increase its quantity by 1
    }
    else {
        cartItems[idToAdd] = 1; // Else Add it to Cart
    }

    saveCart();
    showCatalog(catalog);
}


// Get the catalog from mobiles.json,
// update minimum and maximum Prices in Price Filter
function fetchCatalog() {
    $.getJSON("data/televisions.json", function (data) {
        catalog = data;
        // Find minimum Price and update min-price
        $("#min-price").attr('value', catalog.reduce(function(a, b){
            if(a==catalog[0]){
                return Math.min(a.price, b.price);
            }
            else{
                return Math.min(a, b.price);
            }
        }));
        // Find maximum Price and update max-price
        $("#max-price").attr('value', catalog.reduce(function(a, b){
            if(a==catalog[0]){
                return Math.max(a.price, b.price);
            }
            else{
                return Math.max(a, b.price);
            }
        }));

        // Show the Catalog
        showCatalog(catalog);
    });
}
// Sort, Filter and Show the catalog passed
function showCatalog(catalog) {

    // SORT THE CATALOG
    var id = $("#sort-select").find('option:selected').attr('value');
    if (id == 0) {    // Sort in Ascending Order
        catalog = catalog.sort(function (item1, item2) {
            return item1.price - item2.price;
        });
    }
    else if (id == 1) {    // Sort in descending order
        catalog =  catalog.sort(function (item1, item2) {
            return item2.price - item1.price;
        });
    }

    // APPLY THE PRICE FILTERS
    var minPrice = Number($("#min-price").val());
    var maxPrice = Number($("#max-price").val());

    catalog = catalog.filter(function(item) {
        return item.price >= minPrice && item.price <= maxPrice;
    });

    // APPLY THE BRAND FILTERS
    var brandsSelected = document.querySelectorAll("#brands input:checked");
    console.log(brandsSelected);
    if(brandsSelected[0]){
        catalog = catalog.filter(function(item){
            var found = false;
            for(var i of brandsSelected){
                if(item.brand==i.value)
                    found = true;
            }
            return found;
        });
    }

    // Apply EXCLUDE SELECTED FILTER
    if(excludeSelected.is(':checked')){
        catalog = catalog.filter(function(item){
            return !(cartItems[item.id]);
        });
    }
    // Apply COD Filter
    if(onlyCOD.is(':checked')){
        catalog = catalog.filter(function(item){
            return !!(item.cod);
        });
    }


    // Show the Sorted and Filtered Catalog
    if (catalog[0]) {
        console.log('hello');
        // Show the Sorted and Filtered Catalog
        itemsList.html("");
        for (var item of catalog) {
            addItemToList(item);
        }
        $(".addCart").click(addToCart);
    }
    else{
        itemsList.html("");
        itemsList.append(`
                <div class="h1 text-center text-primary my-5 mx-5">Sorry, no results matched</div>
        `)
    }
}

// Add passed item to the List of items
function addItemToList(item) {
    var quantity = cartItems[item.id];
    if (!quantity) {
        quantity = 0;
    }
    var newItem = $("<div class='col-sm-6 col-lg-4'>");
    newItem.html(
        `
        <div class="card py-2" data-id="${item.id}">
            <img class="card-img-top img-fluid px-1" src="${item.url}" alt="Card image">
            <div class="card-block text-center">
                <h4 class="card-title">${item.name}</h4>
                <p class="card-text">₹ ${item.price}</p>
                <button class="btn btn-outline-primary addCart">
                    Add to Cart
                    <span class="badge badge-pill badge-danger">${quantity}</span>
                </button>
            </div>
        </div>
`
    );
    itemsList.append(newItem);
}



// Get the Cart from the local Storage
function fetchCart() {
    var cart = JSON.parse(localStorage.getItem('cart'));
    if (cart) {
        cartItems = cart;
    }
}
// Save the cartItems to the local Storage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cartItems));
}
