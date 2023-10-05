function dateFormatted(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

!(function () {
  let today = moment();

  function Calendar(selector, events) {
    this.el = document.querySelector(selector);
    this.events = events;
    this.current = moment().date(1);
    this.draw();
    let current = document.querySelector(".today");
    if (current) {
      let self = this;
      window.setTimeout(function () {
        self.openDay(current);
      }, 500);
    }
  }

  Calendar.prototype.draw = function () {
    //Create Header
    this.drawHeader();

    //Draw Month
    this.drawMonth();

    this.drawLegend();
  };

  Calendar.prototype.drawHeader = function () {
    let self = this;
    if (!this.header) {
      //Create the header elements
      this.header = createElement("div", "header");
      this.header.className = "header";

      this.title = createElement("h1");

      let right = createElement("div", "right");
      right.addEventListener("click", function () {
        self.nextMonth();
      });

      let left = createElement("div", "left");
      left.addEventListener("click", function () {
        self.prevMonth();
      });

      //Append the Elements
      this.header.appendChild(this.title);
      this.header.appendChild(right);
      this.header.appendChild(left);
      this.el.appendChild(this.header);
    }

    this.title.innerHTML = this.current.format("MMMM YYYY");
  };

  Calendar.prototype.drawMonth = function () {
    let self = this;

    if (this.month) {
      this.oldMonth = this.month;
      this.oldMonth.className = "month out " + (self.next ? "next" : "prev");
      this.oldMonth.addEventListener("webkitAnimationEnd", function () {
        self.oldMonth.parentNode.removeChild(self.oldMonth);
        self.month = createElement("div", "month");
        self.backFill();
        self.currentMonth();
        self.fowardFill();
        self.el.appendChild(self.month);
        window.setTimeout(function () {
          self.month.className = "month in " + (self.next ? "next" : "prev");
        }, 16);
      });
    } else {
      this.month = createElement("div", "month");
      this.el.appendChild(this.month);
      this.backFill();
      this.currentMonth();
      this.fowardFill();
      this.month.className = "month new";
    }
  };

  Calendar.prototype.backFill = function () {
    let clone = this.current.clone();
    let dayOfWeek = clone.day();

    if (!dayOfWeek) {
      return;
    }

    clone.subtract("days", dayOfWeek + 1);

    for (let i = dayOfWeek; i > 0; i--) {
      this.drawDay(clone.add("days", 1));
    }
  };

  Calendar.prototype.fowardFill = function () {
    let clone = this.current.clone().add("months", 1).subtract("days", 1);
    let dayOfWeek = clone.day();

    if (dayOfWeek === 6) {
      return;
    }

    for (let i = dayOfWeek; i < 6; i++) {
      this.drawDay(clone.add("days", 1));
    }
  };

  Calendar.prototype.currentMonth = function () {
    let clone = this.current.clone();

    while (clone.month() === this.current.month()) {
      this.drawDay(clone);
      clone.add("days", 1);
    }
  };

  Calendar.prototype.getWeek = function (day) {
    if (!this.week || day.day() === 0) {
      this.week = createElement("div", "week");
      this.month.appendChild(this.week);
    }
  };

  Calendar.prototype.drawDay = function (day) {
    let self = this;
    this.getWeek(day);

    //Outer Day
    let outer = createElement("div", this.getDayClass(day));
    outer.addEventListener("click", function () {
      const details = document.querySelector(".details");
      if (details && details.parentNode === this.parentNode) {
        // If details are already open for this day, close them
        details.parentNode.removeChild(details);
      } else {
        // If details are not open, open them
        self.openDay(this);
      }
        });

    //Day Name
    let name = createElement("div", "day-name", day.format("ddd"));

    //Day Number
    let number = createElement("div", "day-number", day.format("DD"));

    //Events
    let events = createElement("div", "day-events");
    this.drawEvents(day, events);

    outer.appendChild(name);
    outer.appendChild(number);
    outer.appendChild(events);
    this.week.appendChild(outer);
  };

  Calendar.prototype.drawEvents = function (day, element) {
    if (day.month() === this.current.month()) {
      let todaysEvents = this.events.reduce(function (memo, ev) {
        // Parse the date string into a Moment.js object
        const evDate = moment(ev.date, "YYYY-MM-DD");

        if (evDate.isSame(day, "day")) {
          memo.push(ev);
        }
        return memo;
      }, []);

      todaysEvents.forEach(function (ev) {
        let evSpan = createElement("span", ev.color);
        element.appendChild(evSpan);
      });
    }
  };

  Calendar.prototype.getDayClass = function (day) {
    classes = ["day"];
    if (day.month() !== this.current.month()) {
      classes.push("other");
    } else if (today.isSame(day, "day")) {
      classes.push("today");
    }
    return classes.join(" ");
  };

  // Inside the Calendar.prototype.openDay function, update the rendering of events:

  Calendar.prototype.openDay = function (el) {
    let details, arrow;
    let dayNumber =
      +el.querySelectorAll(".day-number")[0].innerText ||
      +el.querySelectorAll(".day-number")[0].textContent;
    let day = this.current.clone().date(dayNumber);

    let currentOpened = document.querySelector(".details");

    // Check to see if there is an open details box on the current row
    if (currentOpened && currentOpened.parentNode === el.parentNode) {
      details = currentOpened;
      arrow = document.querySelector(".arrow");
    } else {
      // Close the open events on different week row
      if (currentOpened) {
        currentOpened.parentNode.removeChild(currentOpened);
      }

      // Create the Details Container
      details = createElement("div", "details in");

      // Create the arrow
      let arrow = createElement("div", "arrow");

      // Create the event wrapper
      let eventsWrapper = createElement("div", "events");

      details.appendChild(arrow);
      details.appendChild(eventsWrapper);
      el.parentNode.appendChild(details);
    }

    let todaysEvents = this.events.filter(function (ev) {
      // Filter events that match the clicked date
      return moment(ev.date).isSame(day, "day");
    });

    this.renderEvents(todaysEvents, details);
    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + "px";
  };

  // Update the renderEvents method to populate event details correctly:

  Calendar.prototype.renderEvents = function (events, ele) {
    // Remove any events in the current details element
    let currentWrapper = ele.querySelector(".events");
    let wrapper = createElement(
      "div",
      "events in" + (currentWrapper ? " new" : "")
    );

    events.forEach(function (ev) {
      // Create event elements with event data
      let div = createElement("div", "event");
      let square = createElement("div", "event-category " + ev.color);
      let span = createElement("span", "", ev.eventName); // Use ev.eventName to display the event name

      div.appendChild(square);
      div.appendChild(span);
      wrapper.appendChild(div);
    });

    if (!events.length) {
      // Display a message when there are no events
      let div = createElement("div", "event empty");
      let span = createElement("span", "", "No Events");

      div.appendChild(span);
      wrapper.appendChild(div);
    }

    if (currentWrapper) {
      currentWrapper.className = "events out";
      currentWrapper.addEventListener("animationend", function () {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
    } else {
      ele.appendChild(wrapper);
    }
  };

  Calendar.prototype.drawLegend = function () {
    let legend = createElement("div", "legend");
    let calendars = this.events
      .map(function (e) {
        return e.calendar + "|" + e.color;
      })
      .reduce(function (memo, e) {
        if (memo.indexOf(e) === -1) {
          memo.push(e);
        }
        return memo;
      }, [])
      .forEach(function (e) {
        let parts = e.split("|");
        let entry = createElement("span", "entry " + parts[1], parts[0]);
        legend.appendChild(entry);
      });
    this.el.appendChild(legend);
  };

  Calendar.prototype.nextMonth = function () {
    this.current.add("months", 1);
    this.next = true;
    this.draw();
  };

  Calendar.prototype.prevMonth = function () {
    this.current.subtract("months", 1);
    this.next = false;
    this.draw();
  };

  window.Calendar = Calendar;

  function createElement(tagName, className, innerText) {
    let ele = document.createElement(tagName);
    if (className) {
      ele.className = className;
    }
    if (innerText) {
      ele.innderText = ele.textContent = innerText;
    }
    return ele;
  }
})();


!(function () {
  let data = [
    {
      date: "2023-10-05",
      eventName: "Lunch Meeting w/ Mark",
      calendar: "Work",
      color: "orange",
    },
    {
      date: "2023-10-05",
      eventName: "Interview - Jr. Web Developer",
      calendar: "Work",
      color: "orange",
    },
    {
      date: "2023-10-05",
      eventName: "Demo New App to the Board",
      calendar: "Work",
      color: "orange",
    },
    {
      date: "2023-10-05",
      eventName: "Dinner w/ Marketing",
      calendar: "Work",
      color: "orange",
    },

    {
      date: "2023-10-05",
      eventName: "Game vs Portalnd",
      calendar: "Personal",
      color: "blue",
    },
    {
      date: "2023-10-05",
      eventName: "Game vs Houston",
      calendar: "Personal",
      color: "blue",
    },
    {
      date: "2023-10-05",
      eventName: "Game vs Denver",
      calendar: "Personal",
      color: "blue",
    },
    {
      date: "2023-10-05",
      eventName: "Game vs San Degio",
      calendar: "Personal",
      color: "blue",
    },

    {
      date: "2023-10-05",
      eventName: "School Play",
      calendar: "kids",
      color: "yellow",
    },
    {
      date: "2023-10-05",
      eventName: "Parent/Teacher Conference",
      calendar: "kids",
      color: "yellow",
    },
    {
      date: "2023-10-05",
      eventName: "Pick up from Soccer Practice",
      calendar: "kids",
      color: "yellow",
    },
    {
      date: "2023-10-05",
      eventName: "Ice Cream Night",
      calendar: "kids",
      color: "yellow",
    },

    {
      date: "2023-10-05",
      eventName: "Free Tamale Night",
      calendar: "other",
      color: "green",
    },
    {
      date: "2023-10-05",
      eventName: "Bowling Team",
      calendar: "other",
      color: "green",
    },
    {
      date: "2023-10-05",
      eventName: "Teach Kids to Code",
      calendar: "other",
      color: "green",
    },
    {
      date: "2023-10-05",
      eventName: "Startup Weekend",
      calendar: "other",
      color: "green",
    },
  ];

  fetch("https://kind-pink-iguana-gown.cyclic.app/agenda/agendaDetail", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((agendaDatas) => {
      console.log(agendaDatas);
      data = data.slice(0, agendaDatas.length);
      data.forEach((particularData, i) => {
        if (agendaDatas[i]) {
          particularData.eventName = agendaDatas[i].appointmentName;
          particularData.calendar = agendaDatas[i].appointmentType;
          particularData.date = agendaDatas[i].appointmentDate;
          particularData.formattedAppointmentDate = dateFormatted(
            agendaDatas[i].appointmentDate
          );
        }
      });
      console.log(data);
      function addDate(ev) {}

      let calendar = new Calendar("#calendar", data);
      function updateRightPanel(filteredAppointments) {
        console.log("updateRightPanel called");
        const agendaContainer2 = document.querySelector(".agenda-container2");
        agendaContainer2.innerHTML = ""; // Clear the existing content

        // Loop through filtered appointments and render them in the right panel
        filteredAppointments.forEach(function (appointment) {
          const matchingData = data.find(
            (dataItem) =>
              dataItem.eventName === appointment.appointmentName &&
              dataItem.date === appointment.appointmentDate
          );
          console.log("matchingData", matchingData);
          if (matchingData) {
            const appointmentElement = document.createElement("div");
            appointmentElement.className = "appointment"; // Set the CSS class
            console.log(
              "appointment.formattedAppointmentDate",
              appointment.formattedAppointmentDate
            );
            // Create and set the inner HTML for the appointmentElement
            appointmentElement.innerHTML = `
                    <div id="frame-agenda2" class="agenda-info">
                      <br>
                      <h3 class="text-uppercase fw-bold">${appointment.appointmentName}</h3>
                      <h4>On ${matchingData.formattedAppointmentDate}</h4>
                      <br>
                    
                      <hr class="appointment">
                      <h4>This is ${appointment.profileName}'s Appointment</h4>
                      <br><br>
                      <h4>At ${appointment.appointmentTime} for ${appointment.duration}min</h4>
                      <br><br>
                      <h4 class="text-capitalize">${appointment.appointmentType}</h4><h4> with ${appointment.appointmentwith}</h4>
                      <br>
                    </div>
                  `;

            agendaContainer2.appendChild(appointmentElement);
          }
        });
      }
      let selectedDate = null
            document
        .getElementById("calendar")
        .addEventListener("click", function (event) {
          if (event.target.classList.contains("day-number")) {
            // Extract the clicked date from the calendar element
            // const clickedDate = moment(event.target.textContent, "DD").format(
            //   "YYYY-MM-DD"
            // );
            // Extract the clicked date from the calendar element
            if (event.target.classList.contains("day-number")) {
              // Extract the clicked date from the calendar element
              const clickedDay = event.target.textContent;
              const clickedMonth = calendar.current.month() + 1; // Get the current month (add 1 because months are 0-indexed)
              const clickedYear = calendar.current.year(); // Get the current year
              const clickedDate = moment(`${clickedYear}-${clickedMonth}-${clickedDay}`, "YYYY-MM-DD").format("YYYY-MM-DD");
        

            console.log("clicked date",clickedDate)
            if (selectedDate === clickedDate) {
              // If all appointments are displayed, reload the page to show the initial view
              selectedDate = null
              location.reload();
            }
            else {
            // Filter appointments based on the clicked date
            const filteredAppointments = agendaDatas.filter(function (
              appointment
            ) {
              // Parse the appointment date using moment.js
              const formattedAppointmentDate = moment(
                appointment.appointmentDate
              ).format("YYYY-MM-DD");

              // Check if the appointment date matches the clicked date
              return formattedAppointmentDate === clickedDate;
                                    });
            console.log("filteredAppointments", filteredAppointments);

            // Update the right panel with filtered appointments
            updateRightPanel(filteredAppointments);
            selectedDate = clickedDate;
                    }
        }
        }
        });
      
          })

    .catch((error) => {
      console.error("Fetch error:", error);
    });
})();
