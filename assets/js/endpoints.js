let local = true;
console.log(window.location.href)

if ((window.location.href).contains("https")) local = false
let baseUrl = local
  ? "http://localhost:5000/api/"
  : "https://syntek-api.herokuapp.com/api/";
let productsEndpoint = baseUrl + "products";
let ordersEndpoint = baseUrl + "orders";
let dashboardsEndpoint = baseUrl + "dashboards";
let authEndpoint = baseUrl + "auth";
