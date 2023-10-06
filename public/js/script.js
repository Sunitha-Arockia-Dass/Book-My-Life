const agendaInfoList = document.querySelectorAll(".agenda-info");
const agendaDetails = document.querySelectorAll(".details-app");

agendaInfoList.forEach((agendaInfo, index) => {
  agendaInfo.addEventListener("click", (event) => {
    if (agendaDetails[index].style.display === "block") {
      agendaDetails[index].style.display = "none";
    } else {
      agendaDetails.forEach((agendaDetail) => {
        agendaDetail.style.display = "none";
      });

      agendaDetails[index].style.display = "block";
    }
  });
});

// In your client-side JavaScript (e.g., a separate .js file or inline script in your HTML)
document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("bmiChart").getContext("2d");

  // Use the data that you passed from the server
  const bmiData = JSON.parse(document.getElementById("bmiData").value);
  const createdDates = JSON.parse(
    document.getElementById("createdDates").value
  );
  console.log('bmidata', bmiData )
  console.log('createddates', createdDates )
  if(bmiData.length === 0 || bmiData.length === 1){
    // Default values
    createdDates.push("Oct 2, 2023", "Oct 2, 2023");
  }
  
  const normalData = Array(createdDates.length).fill(25);
  const overweightData = Array(createdDates.length).fill(30);
  const obeseData = Array(createdDates.length).fill(40);
  const underweightData = Array(createdDates.length).fill(18.5);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: createdDates,
      datasets: [
        {
          label: "Your BMI",
          data: bmiData,
          borderColor: "rgb(150, 54, 150,1)",
          borderWidth: 3,
          fill: false,
        },
        {
          label: "Normal BMI",
          data: normalData,
          borderColor: "rgba(0, 255, 0, 1)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 0,
          // fill: "true",
        },
        {
          label: "Overweight BMI",
          data: overweightData,
          borderColor: "rgba(255, 255, 0, 1)",
          backgroundColor: "rgba(255, 255, 0, 0.2)",
          borderWidth: 0,
          fill: "-1",
        },
        {
          label: "Obese BMI",
          data: obeseData,
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          borderWidth: 0,
          fill: "-1",
        },
        {
          label: "Underweight BMI",
          data: underweightData,
          borderColor: "rgba(0, 0, 255, 1)",
          backgroundColor: "rgba(0, 0, 255,  0.2)",
          borderWidth: 0,
          fill: "start",
        },
      ],
    },
    options: {
      scales:{
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Date Checked',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'BMI',
        },
    },
  }
  }
  })

});

document.addEventListener("DOMContentLoaded", function () {
  const ctxNutrition = document
    .getElementById("nutritionChart")
    .getContext("2d");

  const carbohydrates = document.getElementById("carbohydrates").value;
  const protein = document.getElementById("protein").value;
  const fat = document.getElementById("fat").value;
  const fiber = document.getElementById("fiber").value;
  console.log(carbohydrates, protein, fat, fiber);
  new Chart(ctxNutrition, {
    type: "pie",
    data: {
      labels: ["Protein", "Fat", "Fiber", "Carbohydrates"],
      datasets: [
        {
          data: [protein, fat, fiber, carbohydrates],
          backgroundColor: ["#ead94c", "#963696", "#dda0dd", "#eed2ee"],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const ctxBmiKids = document
    .getElementById("bmiChartKid")
    .getContext("2d");


    // Use the data that you passed from the server
     const ageData = JSON.parse(document.getElementById("ageData").value);
    const bmiPercentile = JSON.parse(
      document.getElementById("percentile").value
    );
    if(bmiPercentile.length === 0 || bmiPercentile.length === 1){
      // Default values
      ageData.push("Oct 2, 2023", "Oct 2, 2023");
    }
     const normalData = Array(bmiPercentile.length).fill(85);
    const overweightData = Array(bmiPercentile.length).fill(95);
     const obeseData = Array(bmiPercentile.length).fill(120);
    const underweightData = Array(bmiPercentile.length).fill(10);
  
    new Chart(ctxBmiKids, {
      type: "line",
      data: {
        labels: ageData,
        datasets: [
          {
            label: 'BMI Percentile',
            data: bmiPercentile,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
          {
            label: "Normal Percentile",
            data: normalData,
            borderColor: "rgba(0, 255, 0, 1)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: 0,
            // fill: "true",
          },
          {
            label: "Overweight Percentile",
            data: overweightData,
            borderColor: "rgba(255, 255, 0, 1)",
            backgroundColor: "rgba(255, 255, 0, 0.2)",
            borderWidth: 0,
            fill: "-1",
          },
          {
            label: "Obese Percentile",
            data: obeseData,
            borderColor: "rgba(255, 0, 0, 1)",
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            borderWidth: 0,
            fill: "-1",
          },
          {
            label: "Underweight Percentile",
            data: underweightData,
            borderColor: "rgba(0, 0, 255, 1)",
            backgroundColor: "rgba(0, 0, 255,  0.2)",
            borderWidth: 0,
            fill: "start",
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Age in Months',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Percentile',
            },
          },
        },
      },
    });
});
