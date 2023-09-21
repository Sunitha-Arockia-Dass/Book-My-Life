// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("BML JS imported successfully!")
// })

// window.onload = function () {

//   /*//////////////////////////////////////////////////////////////
//   HIDE THE MENU DEPENDING ON THE LOG STATUS
//    */
//   const logInId = document.getElementById("is-log-in")
//   const logOutId = document.getElementById("is-log-out")
//   // middleware
//   const isLoggedOut = require("../middleware/isLoggedOut")
//   const isLoggedIn = require("../middleware/isLoggedIn")

//     if (isLoggedIn) {
//       logInId.style.display = "block"
//       logOutId.style.display = "none"
//     }

//     if (isLoggedOut) {
//       logInId.style.display = "none"
//       logOutId.style.display = "block"
//     }

//   // close window.onload
// }

// const form = document.getElementById("form");




// In your client-side JavaScript (e.g., a separate .js file or inline script in your HTML)
document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("bmiChart").getContext("2d");
  
    // Use the data that you passed from the server
    const bmiData = JSON.parse(document.getElementById("bmiData").value);
  const createdDates = JSON.parse(document.getElementById("createdDates").value);
  const normalData = Array(bmiData.length).fill(25); 
  const overweightData = Array(bmiData.length).fill(30);
  const obeseData = Array(bmiData.length).fill(40); 
  const underweightData = Array(bmiData.length).fill(18.5);
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
    });
  });
  
const breakfastBtn=document.getElementById("breakfast")
const lunchBtn=document.getElementById("lunch")
const dinnerBtn=document.getElementById("dinner")
const paleoBtn=document.getElementById("paleo")
const vegetarianBtn=document.getElementById("vegetarian")
const veganBtn=document.getElementById("vegan")
const breakfastMenu=document.querySelector(".breakfast-menu")
const lunchMenu=document.querySelector(".lunch-menu")
const dinnerMenu=document.querySelector(".dinner-menu")
const paleoMenu=document.querySelector(".paleo")
const vegetarianMenu=document.querySelector(".vegetarian")
const veganMenu=document.querySelector(".vegan")




breakfastBtn.addEventListener("click",(event)=>{
  breakfastMenu.style.display="block"

})
lunchBtn.addEventListener("click",(event)=>{
  lunchMenu.style.display="block"

})
dinnerBtn.addEventListener("click",(event)=>{
  dinnerMenu.style.display="block"

})

// paleoBtn.addEventListener("click",(event)=>{
//   event.preventDefault()
//   paleoMenu.style.display="block"
//   vegetarianMenu.style.display="none"
//   veganMenu.style.display="none"
// })
// vegetarianBtn.addEventListener("click",(event)=>{
//   event.preventDefault()
//   vegetarianMenu.style.display="block"
//   veganMenu.style.display="none"
//   paleoMenu.style.display="none"

// })
// veganBtn.addEventListener("click",(event)=>{
//   event.preventDefault()
//   veganMenu.style.display="block"
//   paleoMenu.style.display="none"
//   vegetarianMenu.style.display="none"
// })
