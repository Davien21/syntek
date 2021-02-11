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
