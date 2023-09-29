const breakfastBtn = document.getElementById("breakfast")
const lunchBtn = document.getElementById("lunch")
const dinnerBtn = document.getElementById("dinner")
const snackBtn = document.getElementById("snacks")
const breakfastMenu = document.querySelector(".breakfast-menu")
const lunchMenu = document.querySelector(".lunch-menu")
const dinnerMenu = document.querySelector(".dinner-menu")
const snackMenu = document.querySelector(".snack-menu")

const agendaInfoList = document.querySelectorAll(".agenda-info")
const agendaDetails = document.querySelectorAll('.details-app')

agendaInfoList.forEach((agendaInfo, index) => {

  agendaInfo.addEventListener("click", (event) => {
    agendaDetails.forEach((agendaDetail) => {
      agendaDetail.style.display = "none";
    });
    agendaDetails[index].style.display = "block"
  })

})


  // In your client-side JavaScript (e.g., a separate .js file or inline script in your HTML)
  document?.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("bmiChart").getContext("2d")

  // Use the data that you passed from the server
  const bmiData = JSON.parse(document.getElementById("bmiData").value)
  const createdDates = JSON.parse(document.getElementById("createdDates").value)
  const normalData = Array(bmiData.length).fill(25)
  const overweightData = Array(bmiData.length).fill(30)
  const obeseData = Array(bmiData.length).fill(40)
  const underweightData = Array(bmiData.length).fill(18.5)

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
      scales: {
        y: {
          beginAtZero: true,
        },

      },


    },

  })
})


    document?.addEventListener("DOMContentLoaded", function () {
      const ctxNutrition = document.getElementById("nutritionChart").getContext("2d")

  const carbohydrates = document.getElementById("carbohydrates").value
  const protein = document.getElementById("protein").value
  const fat = document.getElementById("fat").value
  const fiber = document.getElementById("fiber").value
  console.log(carbohydrates, protein, fat, fiber)
  new Chart(ctxNutrition, {
    type: "pie",
    data: {
      labels: ["Carbohydrates", "Protein", "Fat", "Fiber"],
      datasets: [
        {
          data: [carbohydrates, protein, fat, fiber],
          backgroundColor: ["#FF5733", "#FFC300", "#C70039", "#581845"],
        },
      ],
    },
    options: {
      responsive: true,

    },
  });


});



    breakfastBtn.addEventListener("click",(event)=>{
      breakfastMenu.style.display="block"
    })
    lunchBtn.addEventListener("click",(event)=>{
      lunchMenu.style.display="block"
    })
    dinnerBtn.addEventListener("click",(event)=>{
      dinnerMenu.style.display="block"
    })
    snackBtn.addEventListener("click",(event)=>{
      snackMenu.style.display="block"
    })

    






