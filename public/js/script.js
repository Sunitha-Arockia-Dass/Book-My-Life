// // https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
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

// form.addEventListener("submit", (event) => {

//   event.preventDefault()

//   const height = document.querySelector('input[name="height"]').value;
//   const weight = document.querySelector('input[name="weight"]').value;

//   const data = { height, weight };

//   fetch(`/health/health`, {
//     method: `POST`,
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data);
//     });
// });


