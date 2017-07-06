var catalog = [];   // Combined Catalog of all Categories
var cartItems = {};

$(function () {
    var clearButton = $("#clear-button");
    clearButton.click(function () {
        cartItems = {};
        saveCart();
        showCart();
    });
    $("#checkout-button").click(function () {
        if (Object.keys(cartItems).length != 0) {
            $("#checkout-modal-heading").text("Success");
            $("#checkout-modal-body").text("Thank you for shopping with us! We hope you like our services.....");
            clearButton.click();
        }
        else {
            $("#checkout-modal-heading").text("Cart Empty");
            $("#checkout-modal-body").text("Your Cart is Empty. Please try again after selecting some items from Catalog. Thank you!");
        }
    });

    fetchCart();
    fetchCatalog();
});

function removeFromCart(event) {
    fetchCart();
    var idToRemove = $(event.target).closest("[data-id]").attr("data-id");
    --cartItems[idToRemove];
    if (cartItems[idToRemove] == 0)
        delete cartItems[idToRemove];

    saveCart();
    showCart();
}

function addToCart(event) {
    fetchCart();
    var idToAdd = $(event.target).closest("[data-id]").attr("data-id");

    if (cartItems[idToAdd]) {
        ++cartItems[idToAdd];
    }
    else {
        cartItems[idToAdd] = 1;
    }
    saveCart();
    showCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cartItems));
}
function fetchCart() {
    var cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
        cartItems = cart;
    }
}


// Fetches Catalog from all Categories and combines them into one
function fetchCatalog() {
    var count = 0;
    $.getJSON("data/mobiles.json", function (data) {
        catalog[0] = data;
        ++count;
        if(count==3){
            showCart();
        }
    });
    $.getJSON("data/laptops.json", function (data) {
        catalog[1] = data;
        ++count;
        if(count==3){
            showCart();
        }
    });
    $.getJSON("data/televisions.json", function (data) {
        catalog[2] = data;
        ++count;
        if(count==3){
            showCart();
        }
    });
}

function showCart() {
    var cartTable = $(".table");
    cartTable.html("");
    if(Object.keys(cartItems).length != 0) {
        cartTable.append(`
                <thead class="bg-primary text-white">
					<tr>
						<th width="900px">Item Name</th>
						<th>Price</th>
						<th>Quantity</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody id="table-body">
				
				</tbody>
        `);

        var cartBody = $("#table-body");
        var tableTotal = 0.0;


        for (id in cartItems) {
            tableTotal += addItemToTable(id, cartBody);
        }

        cartTable.append(`
                <thead class="bg-primary text-white">
					<tr>
						<th colspan="3">TOTAL</th>
						<th id="table-total">₹ ${tableTotal}</th>
					</tr>
				</thead>
        `);

        $(".remove-icon").click(removeFromCart);
        $(".add-icon").click(addToCart);
    }
    else {
        cartTable.append(`
                <div class="h1 text-center text-primary my-5">CART EMPTY</div>
        `)
    }
}

function addItemToTable(id, cartTable) {
    var category = id.split(".")[0];
    var itemId = id.split(".")[1];
    var item = catalog[category][itemId];
    var newItem = $(`<tr data-id="${id}">`);

    var paddingX, paddingY;
    if(category == 0){
        paddingX = 5;
        paddingY = 2;
    }
    else if(category == 1){
        paddingX = 1;
        paddingY = 3;
    }
    else if(category == 2){
        paddingX = 1;
        paddingY = 2;
    }

    newItem.html(
        `
            <td>
                <div class="row">
                    <div class="col-4">
                        <div class="card py-${paddingY}" data-id="${item.id}">
                        <img class="card-img-top img-fluid px-${paddingX}" src="${item.url}" alt="Card image">
                    </div>
                    </div>
                    <div class="col-8">
                        <div class="card-block text-center">
                            <h4 class="card-title">${item.name}</h4>
                        </div>
                    </div>
                </div>	
            </td>
            <td>₹ ${item.price}</td>
            <td class="text-center">
                <i class="fa fa-minus-circle remove-icon float-left"></i>
                ${cartItems[id]}
                <i class="fa fa-plus-circle add-icon float-right"></i>
            </td>
            <td>₹ ${cartItems[id] * item.price}</td>
        `
    );
    cartTable.append(newItem);
    return cartItems[item.id] * item.price;
}