let weeklyChartOptions = (data) => {
  return (options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      width: "1500px",
      height: "200",
    },
    sparkline: {
      enabled: true,
    },
    series: [
      {
        name: "Duration",
        data: data,
      },
    ],
    legend: {
      show: true,
    },

    colors: ["#31D5EC", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],
  });
};

let monthlyChartOptions = (data) => {
  return (options = {
    series: [{ data }],
    chart: {
      type: "bar",
      toolbar: { show: false },
      width: "100%",
      height: "200",
    },
    plotOptions: {
      bar: {
        dataLabels: {
          orientation: "vertical",
          position: "center", // bottom/center/top
        },
      },
    },
    dataLabels: { offsetY: 25 },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            type: "bar",
            toolbar: { show: false },
            width: "500px",
            height: "200",
          },
        },
      },
    ],
  });
};
