//filterbyflag
var flag = "";
var categories = "";
var selectStatus = "";
var searchInputValue = "";
var selectPlacementClient = "";

//Set Focus on Input Search component Select2
$(document).on("select2:open", (e) => {
  const selectId = e.target.id;

  $(
    ".select2-search__field[aria-controls='select2-" + selectId + "-results']"
  ).each(function (key, value) {
    value.focus();
  });
});

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

  document
    .getElementById("submitFilter")
    .addEventListener("click", function () {
      searchInputValue = $("#searchActivity").val();
      flag =
        $("input[type='radio'][name='filter-flag']:checked").length > 0
          ? $("input[type='radio'][name='filter-flag']:checked").val()
          : "";
      categories =
        $("input[type='radio'][name='filter-category']:checked").length > 0
          ? $("input[type='radio'][name='filter-category']:checked").val()
          : "";
      selectStatus =
        $("input[type='radio'][name='filter-status']:checked").length > 0
          ? $("input[type='radio'][name='filter-status']:checked").val()
          : "";
      selectPlacementClient =
        $("#selectPlacement").val() != null ? $("#selectPlacement").val() : "";

      console.log(flag);
      console.log(categories);
      console.log(selectStatus);
      console.log(selectPlacementClient);
      createCalendar();
    });

  document.getElementById("btnSearch").addEventListener("click", function () {
    searchInputValue = $("#searchActivity").val();

    createCalendar();
  });

  document.getElementById("resetFilter").addEventListener("click", function () {
    resetFilter();
  });
    $('#searchActivity').keydown(function (e) {
        if (e.keyCode == 13) {
            searchInputValue = $("#searchActivity").val();
            console.log(searchInputValue);

            createCalendar();
        }
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
        "&placement=" +
        selectPlacementClient +
        "&search=" +
        searchInputValue;

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
    url: "https://localhost:7177/api/ClientName",
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    if (result != null) {
      console.log(result.data);
      result.data.forEach((item) => {
        var option = new Option(item.nameOfClient, item.id, true, false);
        selectPlacement.add(option);
      });
    }
  });

  $("#selectPlacement").select2({
    placeholder: "Choose client",
    dropdownParent: $("#offcanvasRight"),
    width: "100%",
    height: "100%",
    allowClear: false,
    tags: true,
  });
}

function resetFilter() {
  $("#selectPlacement").select2(
    "val",
    $("#selectPlacement option:eq(0)").val()
  );

  $("#exampleFormControlInput1").val("");

  $("input[type='radio']").prop("checked", false);

  flag = "";
  categories = "";
  selectStatus = "";
  searchInputValue = "";
  selectPlacementClient = "";
  createCalendar();
}
