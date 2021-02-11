let allProducts;
let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) renderEmptyCartHTML();

async function getAllProducts() {
  try {
    let response = await fetch(productsEndpoint);
    response = await response.json().then((data) => data);
    return response;
  } catch (ex) {
    return { status: false, message: ex };
  }
}
window.onload = async () => {
  allProducts = await getAllProducts();
  renderProducts(allProducts);
};

function getCartQuantityInLocalStorage() {
  let quantity = 0;
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart) return 0;
  cart.forEach((product) => (quantity += product.quantity));
  return quantity;
}

function increaseQuantity(btn) {
  let parentDiv = btn.closest(".product-details");
  let productQuantity = $(btn).siblings("div.product-quantity");
  let productId = $(parentDiv).data("product-id");
  let cart = JSON.parse(localStorage.getItem("cart"));

  let product = cart.find((product) => product.productId === productId);
  if (product) increaseItemQuantity(cart, product, productId);

  let newQuantity = Number(productQuantity.text()) + 1;
  productQuantity.text(newQuantity);
}

function reduceQuantity(btn) {
  let parentDiv = btn.closest(".product-details");
  let productQuantity = $(btn).siblings("div.product-quantity");
  let productId = $(parentDiv).data("product-id");
  let cart = JSON.parse(localStorage.getItem("cart"));

  let product = cart.find((product) => product.productId === productId);
  if (product) reduceItemQuantity(cart, product, productId);

  if (productQuantity === 1) return;
  let newQuantity = Number(productQuantity.text()) - 1;
  productQuantity.text(newQuantity);
}

function increaseItemQuantity(cart, product, productId) {
  let productIndex = cart.findIndex(
    (product) => product.productId === productId
  );
  product.quantity++;
  cart.splice(productIndex, 1, product);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderProducts(allProducts);
}

function reduceItemQuantity(cart, product, productId) {
  console.log(product.quantity);
  if (product.quantity === 1) return;

  let productIndex = cart.findIndex(
    (product) => product.productId === productId
  );
  product.quantity--;
  cart.splice(productIndex, 1, product);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderProducts(allProducts);
}

function renderEmptyCartHTML() {
  let emptyCartHTML = `
  <section class="pl-md-5 mt-4 mt-md-0">
    <div class="py-5 px-4">
      <h2>Your Cart is empty</h2>
    </div>
  </section>
   `;
  $("main").empty();
  $("main").append(emptyCartHTML);
  let cartQuantity = getCartQuantityInLocalStorage();
  $(".cart-quantity").text(cartQuantity);
}

function renderProducts(products) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) return renderEmptyCartHTML();
  let cartQuantity = getCartQuantityInLocalStorage();
  $(".cart-quantity").text(cartQuantity);

  $(".cartContainer").empty();

  let totalCost = "₦" + getTotalCartCost(cart, products);

  $(".total-cart-cost").text(totalCost);

  cart.forEach((cartItem) => {
    let productInDB = products.find(
      (product) => cartItem.productId === product._id
    );
    if (!productInDB) return;
    $(".cartContainer").append(productHTML(productInDB, cartItem));
  });
}

let productHTML = (productInDB, cartItem) => {
  return `
  <div class="product-details mb-3" data-product-id=${productInDB._id}>
    <div class="d-flex flex-wrap">
      <div class="col-auto">
        <img
          style="max-width: 60px"
          src=${productInDB.imageUrl}
          alt=""
        />
      </div>
      <div class="col-md-auto">
        <div class="product-name row">${productInDB.name}</div>
        <div class="row">
          <span onclick="reduceQuantity(this)" class="my-1 col-auto bg-white rounded paper-box-shadow pointer">-</span>
          <div class="my-2 col-auto px-4 product-quantity">${
            cartItem.quantity
          }</div>
          <span onclick="increaseQuantity(this)" class="my-1 col-auto bg-white rounded paper-box-shadow pointer">+</span>
        </div>
      </div>
      <div class="pl-md-5">
        <span class="product-price h5 pl-md-5">₦${
          productInDB.price * cartItem.quantity
        }</span>
      </div>
      <div class="px-5 ml-auto absolute" style="right: 0;">
        <span onclick="removeItem(this)" style="padding: 4px 11px" class="rounded bg-danger text-white pointer">x</span>
      </div>
    </div>
    <hr>
  </div>
  `;
};

function removeItem(btn) {
  let parentDiv = btn.closest(".product-details");
  let productId = $(parentDiv).data("product-id");

  let willRemoveItem = confirm(
    "Are you sure you want to remove this item from cart"
  );
  if (!willRemoveItem) return;

  let cart = JSON.parse(localStorage.getItem("cart"));
  let productIndex = cart.findIndex(
    (product) => product.productId === productId
  );
  if (productIndex === -1) return;
  if (cart.length === 1 && productIndex !== -1) localStorage.removeItem("cart");

  cart.splice(productIndex, 1);
  localStorage.setItem("cart", JSON.stringify(cart));

  renderProducts(allProducts);
}

function getTotalCartCost(cart, products) {
  let totalCost = 0;
  cart = cart || [];
  cart.forEach((cartItem) => {
    let product = products.find(
      (product) => cartItem.productId === product._id
    );
    if (product) totalCost += cartItem.quantity * product.price;
  });
  return totalCost;
}
