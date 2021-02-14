$("form").on("submit", function (e) {
  e.preventDefault();
});

let loginForm = () => {
  let $inputs = $(
    "form#login-form :input, form#login-form textarea, form#login-form select"
  );
  let values = {};
  $inputs.each(function () {
    if (!this.name) return;
    values[this.name] = $(this).val();
  });
  return (login = values);
};

$("#login-btn").on("click", function login() {
  let admin = loginForm();
  loginAdmin(admin);
});

let $loading = $('#loadingDiv')
$loading.hide()

 
async function loginAdmin(user) {
  $loading.addClass("d-flex justify-content-center align-items-center")
  $loading.show()
  
  try {
    let response = await fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    response = await response.json().then((data) => data);
    
    let successMessage = "You have successfully logged in";
    $loading.hide()
    $loading.removeClass("d-flex justify-content-center align-items-center")

    if (response.status !== true) return notyf.error(response.message);
    if (response.status === true) notyf.success(successMessage);
    localStorage.setItem('authToken', response.data.authToken)
    setTimeout(redirectToDashboard, 2000)

    return response;
  } catch (ex) {
    let errorMessage = "something went wrong, please try again later";
    notyf.error(errorMessage);
    console.log(ex);
    return { status: false, message: ex };
  }
}

function redirectToDashboard () {
  window.location = "./admin-home.html"
}
