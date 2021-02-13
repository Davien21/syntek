$("form").on("submit", function (e) { e.preventDefault()});
let statesUrl = "https://locationsng-api.herokuapp.com/api/v1/states"

async function renderStatesSelect() {
  try {
    let response = await fetch(statesUrl)
    response = await response.json().then((data) => data);
    $("select[name=state]").append(statesOptionsHTML(response))
    return response;
  } catch (ex) {
    return { status: false, message: ex };
  }
}

let statesOptionsHTML = (states) => {
  return states.map(state => state = `<option>${state.name}</option>`)
}

renderStatesSelect()
let orderForm = () => {
  let $inputs = $(
    "form#shipping-details-form :input, form#shipping-details-form textarea, form#shipping-details-form select"
  );
  let values = {};
  values.products = JSON.parse(localStorage.getItem("cart"));
  
  $inputs.each(function () {
    if (this.name == "additionalInfo" && !$(this).val()) return;
    if (!this.name) return;
    values[this.name] = $(this).val();
  });
  console.log(values)
  return (order = values);
};

async function saveOrder(order) {
  const url = "https://syntek-api.herokuapp.com/api/orders/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    response = await response.json().then((data) => data);

    let successMessage = "You have successfully purchased these items";
    
    if (response.status !== true) return notyf.error(response.message)
    if (response.status === true) notyf.success(successMessage);
    setTimeout(redirectToThankYouPage, 2000)
    return response;
  } catch (ex) {
    
    let errorMessage = "something went wrong, please try again later"
    notyf.error(errorMessage)
    console.log(ex)
    return { status: false, message: ex };
  }
}

async function makePayment() {
  let order = orderForm();
  let cart = JSON.parse(localStorage.getItem("cart"));
  let totalCost = getTotalCartCost(cart, allProducts)
  let handler = PaystackPop.setup({
    key: "pk_test_01c02c8965f0795cdb3907687f28a3df955d2b34",
    email: order.email,
    amount: totalCost + "00",
    metadata: {
      custom_fields: [
        {
          customer_phone: order.phone,
        },
      ],
    },
    callback: function (response) {
      order.transactionDetails = response;
      saveOrder(order);
      localStorage.removeItem("cart")
    }
  });
  handler.openIframe();
}

function redirectToThankYouPage () {
  window.location = "./thankYou.html"
}


async function getAllProducts() {
  try {
    let response = await fetch(productsEndpoint);
    response = await response.json().then((data) => data);
    return response;
  } catch (ex) {
    return { status: false, message: ex };
  }
}


 