let cartQuantity = getCartQuantityInLocalStorage();
$(".cart-quantity").text(cartQuantity);

function addToCart(btn) {
  let parentDiv = btn.closest(".product-details");
  let productId = $(parentDiv).data("product-id");

  let message = "This item was successfully added to cart";
  notyf.success(message);

  let cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart) return createCart({ productId, quantity: 1 });

  let product = cart.find((product) => product.productId === productId);
  if (!product) return addNewItemToCart(cart, productId);

  increaseItemQuantity(cart, product, productId);
}

function createCart(cartItems) {
  localStorage.setItem("cart", JSON.stringify([cartItems]));
  increaseCartQuantityinHTML();
}

function increaseCartQuantityinHTML() {
  cartQuantity++;
  $(".cart-quantity").text(cartQuantity);
}

function addNewItemToCart(cart, productId) {
  cart.push({ productId, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  increaseCartQuantityinHTML();
}

function increaseItemQuantity(cart, product, productId) {
  let productIndex = cart.findIndex(
    (product) => product.productId === productId
  );
  product.quantity++;
  cart.splice(productIndex, 1, product);
  localStorage.setItem("cart", JSON.stringify(cart));
  increaseCartQuantityinHTML();
}

function getCartQuantityInLocalStorage() {
  let quantity = 0;
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart) return 0;
  cart.forEach((product) => (quantity += product.quantity));
  return quantity;
}

async function getAllProducts() {
  try {
    let response = await fetch(productsEndpoint);
    response = await response.json().then((data) => data);
    handleProductsHTML(response.data);
    return response;
  } catch (ex) {
    console.log(ex);
    return { status: false, message: ex };
  }
}

let productCard = (product) => {
  if (product.deleted) return ``;
  return (html = `<div class="my-3 col-md-6 col-lg-4 text-center">
  <div class="border pb-3">
    <div >
      <img class="product-img"
        src=${product.imageUrl}
        alt=""
      />
    </div>
    <div
      class="product-details"
      data-product-id=${product._id}
    >
      <p class="mb-2 product-name">${product.name}</p>
      <p class="mb-2 product-price">₦${product.price}</p>
      <button
        onclick="addToCart(this)"
        class="add-to-cart btn def-btn btn-success"
      >
        Add to Cart
      </button>
    </div>
  </div>
</div>`);
};

function renderProducts(products) {
  let productsBody = $("#our-products");
  productsBody.empty();
  let html = ``;
  if (!products.length) return;
  products.forEach((product, index) => {
    html += productCard(product, index);
  });
  productsBody.append(html);
}

getAllProducts();

function handleProductsHTML(products) {
  renderProducts(products);
}
