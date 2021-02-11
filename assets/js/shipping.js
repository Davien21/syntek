$("form").on("submit", function (e) {
  e.preventDefault();
});
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
  return (order = values);
};

async function saveOrder(order) {
  const url = "http://localhost:5000/api/orders/";
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    response = await response.json().then((data) => data);

    let successMessage = "You have successfully purchased these items";
    let errorMessage = "something went wrong, please try again later"
    
    if (response.status !== true) notyf.error(response.message)
    if (response.status === true) notyf.success(successMessage);
    setTimeout(redirectToThankYouPage, 2000)
    return response;
  } catch (ex) {
    
    let errorMessage = "something went wrong, please try again later"
    notyf.error(errorMessage)
    return { status: false, message: ex };
  }
}

async function makePayment() {
  let handler = PaystackPop.setup({
    key: "pk_test_01c02c8965f0795cdb3907687f28a3df955d2b34",
    email: orderForm().email,
    amount: 10000,
    metadata: {
      custom_fields: [
        {
          customer_phone: orderForm().phone,
        },
      ],
    },
    callback: function (response) {
      let order = orderForm();
      order.transactionDetails = response;
      saveOrder(order);
    },
    onClose: function () {
      // alert("window closed");
    },
  });
  handler.openIframe();
}
// notyf.success('message');

function redirectToThankYouPage () {
  window.location = "./thankYou.html"
}