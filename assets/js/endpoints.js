let local = true;
let websiteAddress = window.location.href;

if (websiteAddress.includes("https")) local = false;

let baseUrl = local
  ? "http://localhost:5000/api/"
  : "https://syntek-api.herokuapp.com/api/";
let productsEndpoint = baseUrl + "products";
let ordersEndpoint = baseUrl + "orders";
let dashboardsEndpoint = baseUrl + "dashboards";
let authEndpoint = baseUrl + "auth";
