"use strict";

var itemsList;  // Bootstrap row containing all Item Cards
var catalog = {};   // Catalog as an Object with keys as Data-ID
var cartItems = {}; // Cart as an object with Data-ID:price pairs

// Window.OnLoad
$(function () {
    itemsList = $("#items");
    fetchCart();
    fetchCatalog(catalog);

    $(document).on('change', '#sort-select', sortCatalog);

});

// Sorts the Catalog based on value of the Sort-Select(event.target)
function sortCatalog(event) {
    var id = Number($(event.target)[0].value);
    // Sort in Ascending Order
    if (id == 0) {
        showCatalog(catalog.sort(function (item1, item2) {
            return item1.price - item2.price;
        }));
    }
    // Sort in descending order
    else if (id == 1) {
        showCatalog(catalog.sort(function (item1, item2) {
            return item2.price - item1.price;
        }));

    }
}
// Add the Item in event.target's Card to the catalog
function addToCart(event){
    var idToAdd = $(event.target).closest("[data-id]").attr("data-id");
    console.log(idToAdd);
    if (cartItems[idToAdd]) {   // If Item already in Cart
        ++cartItems[idToAdd];   // Increase its quantity by 1
    }
    else {
        cartItems[idToAdd] = 1; // Else Add it to Cart
    }

    saveCart();
    showCatalog(catalog);
}



// Get the catalog from mobiles.json
function fetchCatalog() {
    $.getJSON("data/mobiles.json", function (data) {
        catalog = data;
        showCatalog(catalog);
    });
}
// Show the catalog passed
function showCatalog(catalog) {
    itemsList.html("");
    for (var id in catalog) {
        addItemToList(id, catalog[id]);
    }
    $(".addCart").click(addToCart);
}
// Add passed item to the List of items
function addItemToList(id, item) {
    var newItem = $("<div class='col-sm-6 col-lg-4'>");
    newItem.html(
        `<div class="card py-2" data-id="${id}">
            <img class="card-img-top img-fluid px-5" src="${item.url}" alt="Card image">
            <div class="card-block text-center">
                <h4 class="card-title">${item.name}</h4>
                <p class="card-text">₹ ${item.price}</p>
                <button class="btn btn-outline-primary addCart">
                    Add to Cart
                </button>
            </div>
        </div>`
    );
    itemsList.append(newItem);
}

// Get the Cart from the local Storage
function fetchCart() {
    var cart = JSON.parse(localStorage.getItem('cart'));
    if(cart){
        cartItems = cart;
    }
}
// Save the cartItems to the local Storage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cartItems));
}
