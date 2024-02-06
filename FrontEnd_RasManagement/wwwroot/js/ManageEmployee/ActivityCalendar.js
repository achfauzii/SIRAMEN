//filterbyflag
var flag = "";
var categories = "";
var selectStatus = "";

$(function () {
  createCalendar();
  document.getElementById("selectflag").addEventListener("change", function () {
    flag = this.value;
    createCalendar();
  });

  document
    .getElementById("selectCategory")
    .addEventListener("change", function () {
      categories = this.value;
      createCalendar();
    });

  document
    .getElementById("selectStatus")
    .addEventListener("change", function () {
      selectStatus = this.value;
      createCalendar();
    });
});

function createCalendar() {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,dayGridWeek,dayGridDay",
    },

    themeSystem: "bootstrap",
    lazyFetching: false,
    eventDidMount: function (info) {
      $(info.el).popover({
        title: info.event.title,
        placement: "bottom",
        html: true,
        content: info.event.extendedProps.description,
        trigger: "hover",
        container: "body",
      });
    },

    events: function (info, successCallback, failureCallback) {
      let start = moment(info.start.valueOf()).format("YYYY-MM-DD");
      let end = moment(info.end.valueOf()).format("YYYY-MM-DD");

      var urlApi = "";
      if (flag != "" && categories != "" && selectStatus != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag +
          "&categories=" +
          categories +
          "&status=" +
          selectStatus;
      }
      // Apply mixed filter by flag and category
      else if (flag != "" && categories != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag +
          "&categories=" +
          categories;
      }
      // Apply mixed filter by flag and status
      else if (flag != "" && selectStatus != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag +
          "&status=" +
          selectStatus;
      }
      // Apply mixed filter by category andselectStatus
      else if (categories != "" && selectStatus != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&categories=" +
          categories +
          "&status=" +
          selectStatus;
      } else if (flag != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag;
      } else if (categories != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&categories=" +
          categories;
      } else if (selectStatus != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&status=" +
          selectStatus;
      } else {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end;
      }

      console.log(
        "Flag: " + flag + " Category " + categories + " Status " + selectStatus
      );

      $.ajax({
        url: urlApi,
        type: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (response) {
          successCallback(response);
        },
      });
    },
  });
  calendar.render();
}

function FilterCalendarbyCategory() {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,dayGridWeek,dayGridDay",
    },

    themeSystem: "bootstrap",
    lazyFetching: false,
    eventDidMount: function (info) {
      $(info.el).popover({
        title: info.event.title,
        placement: "bottom",
        html: true,
        content: info.event.extendedProps.description,
        trigger: "hover",
        container: "body",
      });
    },

    events: function (info, successCallback, failureCallback) {
      let start = moment(info.start.valueOf()).format("YYYY-MM-DD");
      let end = moment(info.end.valueOf()).format("YYYY-MM-DD");

      $.ajax({
        url:
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&categories=" +
          categories,
        type: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (response) {
          successCallback(response);
        },
      });
    },
  });
  calendar.render();
}

function FilterCalendarbyStatus() {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,dayGridWeek,dayGridDay",
    },

    themeSystem: "bootstrap",
    lazyFetching: false,
    eventDidMount: function (info) {
      $(info.el).popover({
        title: info.event.title,
        placement: "bottom",
        html: true,
        content: info.event.extendedProps.description,
        trigger: "hover",
        container: "body",
      });
    },

    events: function (info, successCallback, failureCallback) {
      let start = moment(info.start.valueOf()).format("YYYY-MM-DD");
      let end = moment(info.end.valueOf()).format("YYYY-MM-DD");

      $.ajax({
        url:
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&status=" +
          selectStatus,
        type: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (response) {
          successCallback(response);
        },
      });
    },
  });
  calendar.render();
}
