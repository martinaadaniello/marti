let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("cart");
const totalBox = document.getElementById("total");

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {

    container.innerHTML = "";
    totalBox.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = `
            <p class="empty-cart">
                Il carrello è vuoto.
            </p>
        `;

        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        const subtotal = item.price * item.quantity;

        total += subtotal;

        container.innerHTML += `
            <div class="item">
                <div class="item-media-group">
                    <div class="product-image-wrap">
                        <img src="assets/gisou-product.jpeg" alt="${item.name}" class="product-image">
                    </div>
                    <div class="quantity-controls">
                        <button onclick="decreaseQuantity(${index})">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="increaseQuantity(${index})">+</button>
                    </div>
                </div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p class="item-subtitle">Honey Infused Hair Oil</p>
                    <div class="price">€${subtotal.toFixed(2)}</div>
                </div>
            </div>
        `;
    });

    totalBox.innerHTML = `
        Totale: €${total.toFixed(2)}
    `;
}

function increaseQuantity(index){

    cart[index].quantity++;

    saveCart();

    renderCart();
}

function decreaseQuantity(index){

    cart[index].quantity--;

    if(cart[index].quantity <= 0){

        cart.splice(index, 1);
    }

    saveCart();

    renderCart();
}

renderCart();
