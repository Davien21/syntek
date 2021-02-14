$(".owl-carousel").owlCarousel({
  loop: false,
  margin: 15,
  nav: false,
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
  },
});

async function loadDashboard() {
  let token = localStorage.getItem("authToken");
  try {
    let response = await fetch(dashboardsEndpoint, {
      headers: { "x-auth-token": token },
    });

    response = await response.json().then((data) => data);

    // if (response.status !== true) return notyf.error(response.message);
    // if (response.status === true) notyf.success(successMessage);
    renderDashboard(response);
    return response;
  } catch (ex) {
    let errorMessage = "something went wrong, please try again later";
    notyf.error(errorMessage);
    console.log(ex);
    return { status: false, message: ex };
  }
}

loadDashboard();

function renderDashboard({ data }) {
  renderBaseStats(data);
  renderMonthlyChart(data);
  $("select[name=chartFilter]").on("change", () => renderMonthlyChart(data));
}

function renderBaseStats(data) {
  $(".order-count").text(data.orderCount);
  $(".product-count").text(data.productCount);
  $(".amount-grossed").text(data.amountGrossed);
}

function renderMonthlyChart({ chartData }) {
  $("#chart").empty();
  let filter = $("select[name=chartFilter]").val();
  let chartType = filter === "orderCount" ? "Number" : "Cost";
  $(".chart-type").text(chartType);

  chartData = formattedDataForChart(chartData, filter);
  let chart = new ApexCharts(
    document.querySelector("#chart"),
    monthlyChartOptions(chartData)
  );

  chart.render();
}

let formattedDataForChart = (chartData, filter) => {
  let formattedData = [];
  for (const month in chartData) {
    let data = { x: month, y: chartData[month][filter] };
    formattedData.push(data);
  }
  return formattedData;
};
