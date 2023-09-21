window.onload = function () {

  /*//////////////////////////////////////////////////////////////
  HIDE THE MENU DEPENDING ON THE LOG STATUS
  */

  /*const logOutBtn = document.getElementById("logout")
  const loginBtn = document.getElementById("login")
  const logInId = document.getElementById("is-log-in")
  const logOutId = document.getElementById("is-log-out")

  loginBtn.addEventListener("click", (event) => {
    logOutId.style.display = "none"
    logInId.style.display = "block"  
  })

  logOutBtn.addEventListener("click", (event) => {
    logOutId.style.display = "block"
    logInId.style.display = "none"
  
  })*/
    // windows onload closure
}


  // const form = document.getElementById("form")




  // In your client-side JavaScript (e.g., a separate .js file or inline script in your HTML)
  document.addEventListener("DOMContentLoaded", function () {
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
          //   ticks: {
          //     stepSize: 1, // Specify the step size for the ticks
          //     max: 3, // Set the maximum value for the y-axis
          //   },
        },
        // plugins: {
        //     fillBetween: {
        //       fillColor: "rgba(255, 0, 0, 0.2)", // Color to fill between Normal and Overweight
        //     },
        //   },
        
        },
        
      },
    });
  
  