function renderProducts(products) {
  let productsBody = $("#our-products");
  productsBody.empty();
  let html = ``;
  if (!products.length) return;
  products.forEach((product, index) => {
    product.date = formattedDate(product.createdAt);
    html += productCard(product, index);
  });
  productsBody.append(html);
  $("button.view-product").on("click", function () {
    let productId = $(this)
      .closest("div.product-details")
      .attr("data-productId");
    const product = products.find((product) => product._id === productId);
    renderSingleProduct(product, products);
  });
}

let productCard = (product) => {
  if (product.deleted) return ``;
  return (html = `<div class="my-3 col-md-6 col-lg-4 text-center">
  <div class="product pb-3 paper-box-shadow bg-white">
    <div>
      <img class="product-img"
        src=${product.imageUrl}
        alt=""
      />
    </div>
    <div class="product-details"
      data-productId=${product._id}
    >
      <p class="mb-2 product-name">${product.name}</p>
      <p class="mb-2 product-price">₦${product.price}</p>
      <div class="d-flex py-1">
        <button class="mx-auto col-7 view-product btn btn-success">
          View
        </button>
      </div>
    </div>
  </div>
</div>`);
};

async function getAllProducts() {
  let token = localStorage.getItem("authToken");
  try {
    let response = await fetch(productsEndpoint, {
      headers: { "x-auth-token": token },
    });
    response = await response.json().then((data) => data);
    handleProductsHTML(response.data);
    return response;
  } catch (ex) {
    return { status: false, message: ex };
  }
}

getAllProducts();

function handleProductsHTML(products) {
  renderProducts(products);
  let filterableProps = ["name", "price"];
  handleProductSearch(products, filterableProps);
}

function handleProductSearch(products, filterableProps = null) {
  if (!filterableProps) filterableProps = Object.keys(products);

  $("form#products-search input").on("input", function () {
    const searchString = $(this).val().toLowerCase().trim();
    if (!searchString) return renderProducts(products);

    let filtered = [];
    products.forEach((product) => {
      let filterableProduct = _.pick(product, filterableProps);
      for (const prop in filterableProduct) {
        let value = product[prop].toString().toLowerCase();
        if (!value.includes(searchString) || filtered.includes(product))
          continue;

        filtered.push(product);
      }
    });
    renderProducts(filtered);
  });
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

function renderSingleProduct(product, products) {
  let allProducts = $("main #all-products");
  $("main > div").empty();
  $("main > div").append(singleProduct(product));
  $("button.update-product").on("click", function () {
    let willProcessProduct = confirm(
      "Are you sure you wish to modify this product?"
    );
    if (!willProcessProduct) return;
  });

  $("#single-product button#all-products").on("click", function () {
    $("main #single-product").remove();
    $("main > div").append(allProducts);
    renderProducts(products);
  });
}

let singleProduct = (product) => {
  return `
  <section id="single-product" class="mt-4 pt-2">
    <div class="d-flex pb-3 justify-content-between align-items-center flex-wrap">
      <button id="all-products" class="btn def-btn btn-secondary">
        All Products
      </button>
    </div>
    <div class="container-fluid px-3">
      <div class="row px-3 bg-white">
        <div class="col-12 col-sm-10 mx-auto mx-md-0 col-md-4 d-flex">
          <img class=" mx-auto mx-md-0 single-product-img"
            src=${product.imageUrl}
            alt=""
          />
        </div>
        <div class="col-12 col-md-8 px-3 py-4 text-center text-md-left">
          <div class="d-flex py-2 flex-wrap">
            <span class="pl-sm-0 col-sm-6 col-md-4 font-weight-bold">Name:</span>
            <span class="col">${product.name}</span>
          </div>
          <div class="d-flex py-2 flex-wrap">
            <span class="pl-sm-0 col-sm-6 col-md-4 font-weight-bold">Product id:</span>
            <span class="col">${product._id}</span>
          </div>
          <div class="d-flex py-2 flex-wrap">
            <span class="pl-sm-0 col-sm-6 col-md-4 font-weight-bold">Price:</span>
            <span class="col">₦${product.price}</span>
          </div>
          <div class="mt-4 d-flex py-1">
            <button class="col-7 mx-auto mx-md-0 update-product btn btn-primary">
              Modify Product
            </button>
          </div>
        </div>
      </div>
      <div class="d-none">
        <p class="pl-0 col-auto h3 mb-0 text-black">Statistics</h4>
        <hr>
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

let detailsHTML = (product) => {
  let html = ``;
  html += productDetailHTML("Name", product.name);
  html += productDetailHTML("Email", product.email);
  html += productDetailHTML("Phone Number", product.phone);
  html += productDetailHTML("Address", product.address);
  html += productDetailHTML("State", product.state);
  html += productDetailHTML("City", product.city);
  html += productDetailHTML("Total Cost", product.productCost);
  return html;
};

let productDetailHTML = (key, value) => {
  return `
    <div class="row flex-wrap py-1">
      <div class="col-12 col-md key">${key}:</div>
      <div class="col value">${value}</div>
    </div>
  `;
};
