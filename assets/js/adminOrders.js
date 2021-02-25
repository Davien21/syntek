function activateCarousel() {
  $(".owl-carousel").owlCarousel({
    loop: false,
    margin: 15,
    nav: true,
    dots: false,
    navText: ["<div > ‹ </div>", "<div > › </div>"],

    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1400: {
        items: 4,
      },
    },
  });
}
function renderOrdersTable(orders) {
  let tableBody = $("table#order-table tbody");
  tableBody.empty();
  let html = ``;
  if (!orders.length) return;
  orders.forEach((order, index) => {
    order.date = formattedDate(order.createdAt);
    html += orderRow(order, index);
  });
  tableBody.append(html);
  $("button.view-order").on("click", function () {
    let orderId = $(this).closest("tr").attr("data-orderId");
    const order = orders.find((order) => order._id === orderId);
    renderSingleOrder(order, orders);
  });
}

let orderRow = (order, index) => {
  order.name = `${order.firstName} ${order.lastName}`;
  let status = order.orderStatus;
  return (html = `
  <tr data-orderId=${order._id}>
    <th scope="row">${index + 1}</th>
    <td>${order.name}</td>
    <td>${order.phone}</td>
    <td>${order.date}</td>
    <td>
      <li class="text-${statusClass(status)}">${status}</li>
    </td>
    <td>
      <button class="view-order btn btn-success font-rambla">View</button>
    </td>
  </tr>`);
};

let statusClass = (status) => {
  if (status === "Active") return "warning";
  if (status === "Processed") return "primary";
  if (status === "Closed") return "secondary";
};

async function getAllOrders() {
  let token = localStorage.getItem("authToken");
  try {
    let response = await fetch(ordersEndpoint, {
      headers: { "x-auth-token": token },
    });
    response = await response.json().then((data) => data);
    handleOrdersTable(response.data);
    return response;
  } catch (ex) {
    return { status: false, message: ex };
  }
}

getAllOrders();

function handleOrdersTable(orders) {
  let filterableProps = ["name", "phone", "date", "orderStatus"];
  handleOrderSearch(orders, filterableProps);
  handlePagination(orders);
  handleStatusChange(orders);
}

function handleOrderSearch(orders, filterableProps = null) {
  if (!filterableProps) filterableProps = Object.keys(orders);

  $("form#table-search input").on("input", function () {
    let statusBox = $("div#order-status > div");
    statusBox.removeClass("active");
    $("div#order-status > div:first-child").addClass("active");

    const searchString = $(this).val().toLowerCase().trim();
    if (!searchString) return handlePagination(orders);

    let filtered = [];
    orders.forEach((order) => {
      let filterableOrder = _.pick(order, filterableProps);
      for (const prop in filterableOrder) {
        let value = order[prop].toLowerCase();
        if (!value.includes(searchString) || filtered.includes(order)) continue;

        filtered.push(order);
      }
    });
    renderOrdersTable(filtered);
    handlePagination(filtered);
  });
}

function handlePagination(orders) {
  let pageNumber = 1;
  renderPagination(orders, pageNumber);
}

const formattedDate = (dateString) => {
  let date = new Date(dateString);
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(
    date
  );
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

  return `${day}-${month}-${year}`;
};

function renderPagination(orders, pageNumber) {
  $("#order-pagination").empty();
  const itemsCount = orders.length;
  let pageSize = 10;
  const pagesCount = Math.ceil(itemsCount / pageSize);

  if (itemsCount < pageSize || pagesCount === 1) return;

  $("#order-pagination").append(paginationHTML(pagesCount));

  $("#order-pagination ul.pagination li:nth-child(2)").addClass("active");

  const currentPageOrders = paginate(orders, pageNumber, pageSize);
  renderOrdersTable(currentPageOrders);

  let pageDetails = { orders, pageNumber, pagesCount, pageSize };
  handlePageChange(pageDetails, renderOrdersTable);
}

function handlePageChange(pageDetails, callback) {
  let { orders, pageNumber, pagesCount, pageSize } = pageDetails;
  $("#order-pagination ul.pagination li").on("click", function () {
    let elem = $(this).find("a");

    if (elem.text() === "Previous" && pageNumber > 1) pageNumber--;
    if (elem.text() === "Next" && pageNumber < pagesCount) pageNumber++;
    if (elem.text() !== "Next" && elem.text() !== "Previous")
      pageNumber = $(this).text();

    $("#order-pagination ul.pagination li").removeClass("active");
    $("#order-pagination ul.pagination li").each((index, elem) => {
      if ($(elem).text() === pageNumber) return $(elem).addClass("active");
    });

    const currentPageOrders = paginate(orders, pageNumber, pageSize);
    callback(currentPageOrders);
  });
}

const paginationHTML = (pagesCount) => {
  let listHTML = ``;
  listHTML += `<ul class="pagination">`;
  listHTML += `<li class="page-item">`;
  listHTML += `<a class="page-link" >Previous</a>`;
  listHTML += `</li>`;
  for (let i = 0; i < pagesCount; i++) {
    listHTML += `<li class="page-item">`;
    listHTML += `<a class="page-link" >${i + 1}</a>`;
    listHTML += `</li>`;
  }
  listHTML += `<li class="page-item">`;
  listHTML += `<a class="page-link" >Next</a>`;
  listHTML += `</li>`;
  listHTML += `</ul>`;
  return listHTML;
};

function handleStatusChange(orders) {
  let elem = $("div#order-status > div");
  elem.on("click", function () {
    elem.removeClass("active");
    $(this).addClass("active");
    let filtered = orders.filter(
      (order) => order.orderStatus === $(this).text()
    );
    if (!filtered.length) filtered = orders;
    renderOrdersTable(filtered);
    handlePagination(filtered);
  });
}

function paginate(items, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;

  return _(items).slice(startIndex).take(pageSize).value();
}

function renderSingleOrder(order, orders) {
  let allOrders = $("main #all-orders");
  $("main > div").empty();
  $("main > div").append(singleOrder(order));
  activateCarousel();
  $("div.actions button.process-order").on("click", function () {
    let willProcessOrder = confirm(
      "Are you sure you wish to process this order?"
    );
    if (!willProcessOrder) return;
  });

  $("#single-order button#all-orders").on("click", function () {
    $("main #single-order").remove();
    $("main > div").append(allOrders);
    renderOrdersTable(orders);
  });
}

let singleOrder = (order) => {
  let status = order.orderStatus;
  return `
  <section id="single-order" class="mt-4 px-3 pl-md-5 pl-lg-4 ml-md-5 ml-xl-0">
    <div class="d-flex px-md-3 pb-3 justify-content-between align-items-center flex-wrap">
      <button id="all-orders" class="btn paper-box-shadow rounded-0 font-rambla btn-secondary">
        All Orders
      </button>
      <li class="text-${statusClass(status)}">${status}</li>
    </div>
    <div class="container-fluid px-0 px-md-3">
      <div class="d-flex align-items-center">
        <span class="pl-0 col-auto h3 mb-0 text-black">Order</span>
        <span>#${order._id}</span>
      </div>
      <div class="row py-3">
        <div class="col owl-carousel owl-theme">
          ${itemsCarouselHTML(order.products)}
        </div>
      </div>
      <div class="actions mb-3">
        <button class="process-order btn btn-primary paper-box-shadow">Process Order</button>
      </div>
      <div class="">
        <div class="d-flex justify-content-between">
          <span class="h4">Details</span>
          <span class="">${order.date}</span>
        </div>
        <hr>
        <div class="paper-box rounded-0 p-4">
          ${detailsHTML(order)}
        </div>
      </div>
    </div>
  </section>`;
};

let itemsCarouselHTML = (items) => {
  let html = ``;
  items.forEach((item) => {
    html += carouselItemHTML(item);
  });
  return html;
};

let carouselItemHTML = (item) => {
  let itemWord = item.quantity > 1 ? "Pieces" : "Piece";
  return `
  <div class="item card col" >
    <div class=" py-4">
      <div class="col-auto">
        <img class="" src=${item.imageUrl} alt="" />
      </div>
      <div class="col">
        <p class="font-weight-bold item-name mb-0">10 ml Foil Packs</p>
        <div>
          <span class="item-quantity">${item.quantity} ${itemWord} /</span>
          <span class="item-cost">${item.price * item.quantity}</span>
        </div>
      </div>
    </div>
  </div>
  `;
};

let detailsHTML = (order) => {
  let html = ``;
  html += orderDetailHTML("Name", order.name);
  html += orderDetailHTML("Email", order.email);
  html += orderDetailHTML("Phone Number", order.phone);
  html += orderDetailHTML("Address", order.address);
  html += orderDetailHTML("State", order.state);
  html += orderDetailHTML("City", order.city);
  html += orderDetailHTML("Total Cost", order.orderCost);
  return html;
};

let orderDetailHTML = (key, value) => {
  return `
    <div class="row flex-wrap py-1">
      <div class="col-12 col-md key">${key}:</div>
      <div class="col value">${value}</div>
    </div>
  `;
};
