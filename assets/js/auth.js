let token = localStorage.getItem("authToken");
if (!token) {
  window.location.href = "./admin-login.html";
}

handleAuth();

async function handleAuth() {
  try {
    let response = await fetch(dashboardsEndpoint, {
      headers: { "x-auth-token": token },
    });

    response = await response.json().then((data) => data);

    if (response.status !== true)
      return (window.location.href = "./admin-login.html");
    return response;
  } catch (ex) {
    let errorMessage = "something went wrong, please try again later";
    alert(errorMessage);
    return { status: false, message: ex };
  }
}
