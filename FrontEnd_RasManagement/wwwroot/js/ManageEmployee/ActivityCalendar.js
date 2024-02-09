//filterbyflag
var flag = "";
var categories = "";
var selectStatus = "";
var searchInputValue = "";

$(function () {
  createCalendar();
  document.getElementById("selectflag").addEventListener("change", function () {
    flag = this.value;
    // createCalendar();
  });

  document
    .getElementById("selectCategory")
    .addEventListener("change", function () {
      categories = this.value;
      // createCalendar();
    });

    document.getElementById("selectStatus").addEventListener("change", function () {
      selectStatus = this.value;
      // createCalendar();
    });

    document.getElementById("autoSizingInputGroup").addEventListener("input", function () {
      searchInputValue = this.value;
    });

    document.getElementById('submitFilter').addEventListener('click', function () {
      console.log("Search Input Value: ", searchInputValue);
      console.log("Selected Flag: ", flag);
      console.log("Selected Category: ", categories);
      console.log("Selected Status: ", selectStatus);
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
    // eventDidMount: function (info) {
    //   updatePopoverContent(info);
    // },

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
      // Apply mixed filter by flag, category, and status, search
      if (flag != "" && categories != "" && selectStatus != "" && searchInputValue != "") {
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
          selectStatus +
          "&search=" +
          searchInputValue;
      }

      else if (flag != "" && categories != "" && selectStatus != "") {
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
      // Apply mixed filter by flag and category, search
      else if (flag != "" && categories != "" && searchInputValue != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag +
          "&categories=" +
          categories + "&search=" + searchInputValue;
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
      // Apply mixed filter by flag and status, search
      else if (flag != "" && selectStatus != "" && searchInputValue != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag +
          "&status=" + 
          selectStatus + "&search=" + searchInputValue;    
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
      // Apply mixed filter by category andselectStatus, search
      else if (categories != "" && selectStatus != "" && searchInputValue != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&categories=" +
          categories +
          "&status=" +
          selectStatus + "&search=" + searchInputValue;
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
      } else if (flag != "" && searchInputValue != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag +
          "&search=" +
          searchInputValue;
      } else if (flag != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag;
      } else if (categories != "" && searchInputValue != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&categories=" +
          categories +
          "&search=" +
          searchInputValue;
      } else if (categories != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&categories=" +
          categories;
      } else if (selectStatus != "" && searchInputValue != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&status=" +
          selectStatus +
          "&search=" +
          searchInputValue;
      } else if (selectStatus != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&status=" +
          selectStatus;
      } else if (searchInputValue != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&search=" +
          searchInputValue;
      } else {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end;
      }

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
    eventContent: function (arg) {
      var view = calendar.view;
      var title = "";

      if (view.type === "dayGridDay") {
        title =
          arg.event.title +
          ": " +
          arg.event._def.extendedProps.description.replace(/<br*\/?>/gi, ", ");
        console.log(arg.event._def.extendedProps.description);
      } else {
        // Handle other views as needed
        title = arg.event.title;
      }

      return {
        html: '<div class="custom-event">' + title + "</div>",
      };
    },
  });
  calendar.render();
}
