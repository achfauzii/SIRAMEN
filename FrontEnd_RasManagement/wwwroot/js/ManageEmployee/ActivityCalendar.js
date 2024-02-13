//filterbyflag
var flag = "";
var categories = "";
var selectStatus = "";
var searchInputValue = "";
var selectPlacementClient = "";

$(function () {
  createCalendar();
  getPlacement();
  
  // document.getElementById("selectflag").addEventListener("change", function () {
  //   flag = this.value;
  // });

  // document
  //   .getElementById("selectCategory").addEventListener("change", function () {
  //     categories = this.value;
  //   });

  //   document.getElementById("selectStatus").addEventListener("change", function () {
  //     selectStatus = this.value;
  //   });

  //   document.getElementById("exampleFormControlInput1").addEventListener("input", function () {
  //     searchInputValue = this.value;
  //   });

  //   document.getElementById("selectPlacement").addEventListener("change", function () {
  //     selectPlacementClient = this.value;
  //   });

    document.getElementById('submitFilter').addEventListener('click', function () {
      console.log("Search Input Value: ", $("#exampleFormControlInput1").val());
      console.log("Selected Flag: ", $("#selectflag").val());
      console.log("Selected Category: ", $("#selectCategory").val());
      console.log("Selected Status: ", $("#selectStatus").val());
      console.log("Selected Client: ", $("#selectPlacement").val());

      searchInputValue = $("#exampleFormControlInput1").val();
      flag = $("#selectflag").val();
      categories =  $("#selectCategory").val();
      selectStatus = $("#selectStatus").val();
      selectPlacementClient = $("#selectPlacement").val();
      createCalendar();
    });

    document.getElementById("resetFilter").addEventListener("click", function () {
    resetFilter();
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
      else if (flag != "" && categories != "" && selectStatus != "" && searchInputValue != "" && selectPlacementClient != "") {
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
          searchInputValue + "&placement=" + selectPlacementClient;
      }
      else if (flag != "" && categories != "" && selectStatus != "" && selectPlacementClient != "") {
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
          selectStatus + "&placement=" + selectPlacementClient;
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
      else if (flag != "" && categories != "" && searchInputValue != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag +
          "&categories=" +
          categories + "&search=" + searchInputValue + "&placement=" + selectPlacementClient;
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
      else if (flag != "" && categories != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag +
          "&categories=" +
          categories + "&placement=" + selectPlacementClient;
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
      else if (flag != "" && selectStatus != "" && searchInputValue != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag +
          "&status=" + 
          selectStatus + "&search=" + searchInputValue + "&placement=" + selectPlacementClient;    
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
      // Apply mixed filter by flag and status, placement
      else if (flag != "" && selectStatus != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag +
          "&status=" +
          selectStatus + "&placement=" + selectPlacementClient;
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
       else if (categories != "" && selectStatus != "" && searchInputValue != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&categories=" +
          categories +
          "&status=" +
          selectStatus + "&search=" + searchInputValue + "&placement=" + selectPlacementClient;
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
      else if (categories != "" && selectStatus != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&categories=" +
          categories +
          "&status=" +
          selectStatus + "&placement=" + selectPlacementClient;
      }
      // Apply mixed filter by category and selectStatus
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
      } else if (flag != "" && searchInputValue != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag +
          "&search=" +
          searchInputValue + "&placement=" + selectPlacementClient;
      } else if (flag != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&flag=" +
          flag +
          "&placement=" +
          selectPlacementClient;
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
      } else if (categories != "" && searchInputValue != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&categories=" +
          categories +
          "&search=" +
          searchInputValue + "&placement=" + selectPlacementClient;
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
      } else if (categories != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&categories=" +
          categories + "&placement=" + selectPlacementClient;
      } else if (categories != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&categories=" +
          categories;
      } else if (selectStatus != "" && searchInputValue != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&status=" +
          selectStatus +
          "&search=" +
          searchInputValue + "&placement=" + selectPlacementClient;
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
      } else if (selectStatus != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&status=" +
          selectStatus + "&placement=" + selectPlacementClient;
      } else if (selectStatus != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&status=" +
          selectStatus;
      } else if (searchInputValue != "" && selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&search=" +
          searchInputValue + "&placement=" + selectPlacementClient;
      } else if (searchInputValue != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&search=" +
          searchInputValue;
      } else if (selectPlacementClient != "") {
        urlApi =
          "https://localhost:7177/api/TimeSheet/TimeSheetByMonth" +
          "?start=" +
          start +
          "&end=" +
          end +
          "&placement=" +
          selectPlacementClient;
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



function getPlacement() {
    var selectPlacement = document.getElementById("selectPlacement");

    $.ajax({
        type: "GET",
        url: "https://localhost:7177/api/EmployeePlacements",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        console.log(result)
        if (result != null) {
            result.data.forEach((item) => {
                var option = new Option(item.companyName, item.companyName, true, false);
                selectPlacement.add(option);
            });
        }
    });

    $("#selectPlacement").select2({
        placeholder: "Filter by client",
        width: "100%",
        height: "100%",
        allowClear: true,
        tags: true,
    });
}

function resetFilter() {
  $("#selectflag").append(`<option selected disabled>Filter by flag</option>`);
  $("#selectCategory").append(`<option selected disabled>Filter by category</option>`);
  $("#selectStatus").append(`<option selected disabled>Filter by status</option>`);
  $("#selectPlacement").append(`<option selected disabled>Filter by client</option>`);
  $("#exampleFormControlInput1").val("");
}
