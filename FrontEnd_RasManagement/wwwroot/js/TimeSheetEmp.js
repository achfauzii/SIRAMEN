var table = null;
var validateName = true;

$(document).ready(function () {
  //debugger;
  $("input[required],select[required],textarea[required]").each(function () {
    $(this)
      .prev("label")
      .append('<span class="required" style="color: red;">*</span>');
  });

  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  $.ajax({
    url: "https://localhost:7177/api/Employees/accountId?accountId=" + accid,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var obj = result.data.result;

      $("#fullName").text(obj.fullname);
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });

  // Condition untuk Flag Sick or Leave
  $("#flag").on("change", function () {
    var value = this.value;
    if (value == "Sick" || value == "Leave") {
      $("#activity").attr("disabled", "true");
      $("#category").attr("disabled", "true");
      $("#status").attr("disabled", "true");
      $("#knownBy").attr("disabled", "true");

      $("#activity").removeAttr("required");
      $("#category").removeAttr("required");
      $("#status").removeAttr("required");
      $("#knownBy").removeAttr("required");

      $(".required").remove();
      $("input[required],select[required],textarea[required]").each(
        function () {
          $(this)
            .prev("label")
            .append('<span class="required" style="color: red;">*</span>');
        }
      );

      $("#detail-activity").hide();
    } else {
      $("#activity").removeAttr("disabled");
      $("#category").removeAttr("disabled");
      $("#status").removeAttr("disabled");
      $("#knownBy").removeAttr("disabled");
      $(".required").remove();

      $("#activity").attr("required", "true");
      $("#category").attr("required", "true");
      $("#status").attr("required", "true");
      $("#knownBy").attr("required", "true");

      $("input[required],select[required],textarea[required]").each(
        function () {
          $(this)
            .prev("label")
            .append('<span class="required" style="color: red;">*</span>');
        }
      );
      $("#detail-activity").show();
    }
  });

  // Validasi Known By
  $("#knownBy").on("keyup", function () {
    var value = $(this).val();
    var errorMessage = "";
    var isValidCharacter = true;

    var regex = /^[a-zA-Z'-\s]+$/;

    if (regex.test(value) || value === "") {
      isValidCharacter = true;
      validateName = true;
    } else {
      isValidCharacter = false;
      validateName = false;
      errorMessage = "The field can only use letters.";
    }

    if (!isValidCharacter) {
      $(this).next(".error-message").text(errorMessage).show();
    } else if (isValidCharacter) {
      $(this).next(".error-message").hide();
    }
  });

  //Get CompanyName (Placement)
  $.ajax({
    url:
      "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" +
      accid,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var obj = result.data;
      if (obj && obj.length > 0) {
        var lastData = obj[0];
        $("#compName").text(lastData.client.nameOfClient);
        $("#lastPlacementId").val(lastData.placementStatusId);
      } else {
        console.log("Tidak ada data");
      }
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });

  //GET datatable
  table = $("#timeSheetTable").DataTable({
    scrollX: true,
    // autoWidth: true,
    // responsive: true,
    ajax: {
      url: "https://localhost:7177/api/TimeSheet/accountId?accountId=" + accid, // Your API endpoint
      type: "GET",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
    },
    pagingType: "full_numbers",
    columns: [
      {
        name: "first",
        data: "date",
        render: function (data, type, row) {
          if (type === "display" || type === "filter") {
            // Format tanggal dalam format yang diinginkan
            return moment(data).format("DD MMM YYYY");
          }
          // Untuk tipe data lain, kembalikan data aslinya

          return data;
        },
      },
      { data: "activity" },
      { name: "second", data: "flag" },
      { data: "category" },
      { data: "status" },
      { data: "knownBy" },
      {
        data: null,
        render: function (data, type, row) {
          return (
            '<a class="text-warning text-end" data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return getById(' +
            row.id +
            ')"><i class="fa fa-edit"></i></a>'
          );
        },
      },
    ],
    rowsGroup: ["first:name", "second:name"],
    order: [[0, "desc"]],
    columnDefs: [
      {
        targets: [2, 3, 4, 5, 6],
        orderable: false,
      },
    ],
    //Agar nomor tidak berubah
    /* drawCallback: function (settings) {
                var api = this.api();
                var rows = api.rows({ page: "current" }).nodes();
                var currentPage = api.page.info().page; // Mendapatkan nomor halaman saat ini
                var startNumber = currentPage * api.page.info().length + 1; // Menghitung nomor awal baris pada halaman saat ini
    
                api
                    .column(0, { page: "current" })
                    .nodes()
                    .each(function (cell, i) {
                        cell.innerHTML = startNumber + i; // Mengupdate nomor baris pada setiap halaman
                    });
            },*/

        // backgroud warna dengan flag holiday 
        createdRow: function (row, data, dataIndex) {
            if (data.flag === 'Holiday') {
                $(row).css('background-color', '#FF8080');
                $(row).find('.fa-edit').hide();
            }
            if (data.flag === 'Overtime') {
                $(row).css('background-color', '#EADFB4');
                $(row).find('.fa-edit').hide();
            }
        }
    });

    addRowHoliday();
    addRowApproval();
});

function addRowHoliday() {
  //GET data from tbDataHoliday
  $.ajax({
    url: "https://localhost:7177/api/MasterHoliday",
    type: "GET",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      // Assuming result.data contains the array of holiday objects
      var holidays = result.data;

      // Loop through each holiday object
      holidays.forEach(function (holiday) {
        // Append the holiday data to the timeSheetTable
        var rowData = {
          date: holiday.date,
          activity: holiday.name,
          flag: "Holiday", // Set flag as 'Holiday' for holidays
          category: "", // You can set an appropriate category
          status: "", // You can set an appropriate status
          knownBy: "", // You can set an appropriate value for knownBy
        };
        // Add the holiday data to the timeSheetTable
        table.row.add(rowData).draw();
      });
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function addRowApproval() {
    //GET data from tbDataHoliday
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    $.ajax({
        url: "https://localhost:7177/api/Approval/accountId?accountId=" + accid,
        type: "GET",
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var approvals = result.data;
            approvals.forEach(function (approval) {
                if (approval.statusApproval !== 'Reject' && approval.statusApproval !== 'Approve') {
                    // Append the holiday data to the timeSheetTable
                    var rowData = {
                        date: approval.date,
                        activity: approval.activity,
                        flag: 'Overtime', // Set flag as 'Holiday' for holidays
                        category: approval.category, // You can set an appropriate category
                        status: approval.status, // You can set an appropriate status
                        knownBy: approval.knownBy, // You can set an appropriate value for knownBy
                    };
                    // Add the holiday data to the timeSheetTable
                    table.row.add(rowData).draw();
                }
            });
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

function getById(Id) {
  $.ajax({
    url: "https://localhost:7177/api/TimeSheet/" + Id,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      //debugger;
      var obj = result.data; //data yg dapet dr id

      $("#timeSheetId").val(obj.id); //ngambil data dr api
      $("#lastPlacementId").val(obj.placementStatusId);
      $("#activity").val(obj.activity).attr("data-initial", obj.activity);
      const date = formatDate(obj.date);
      $("#inputDate").val(date).attr("data-initial", obj.date);
      $("#inputDate").prop("disabled", false);
      $("#flag").val(obj.flag).attr("data-initial", obj.flag);
      $("#flag").prop("disabled", false);
      $("#category").val(obj.category).attr("data-initial", obj.category);
      $("#status").val(obj.status).attr("data-initial", obj.status);
      $("#knownBy").val(obj.knownBy).attr("data-initial", obj.knownBy);
      $("#timeSheetModal").modal("show");
      $("#Save").hide();
      $("#Update").show();

      $(".required").remove();
      var value = obj.flag;
      if (value == "Sick" || value == "Leave") {
        $("#activity").attr("disabled", "true");
        $("#category").attr("disabled", "true");
        $("#status").attr("disabled", "true");
        $("#knownBy").attr("disabled", "true");

        $("#activity").removeAttr("required");
        $("#category").removeAttr("required");
        $("#status").removeAttr("required");
        $("#knownBy").removeAttr("required");

        $("input[required],select[required],textarea[required]").each(
          function () {
            $(this)
              .prev("label")
              .append('<span class="required" style="color: red;">*</span>');
          }
        );
        $("#detail-activity").hide();
      } else {
        $("#activity").removeAttr("disabled");
        $("#category").removeAttr("disabled");
        $("#status").removeAttr("disabled");
        $("#knownBy").removeAttr("disabled");

        $("#activity").attr("required", "true");
        $("#category").attr("required", "true");
        $("#status").attr("required", "true");
        $("#knownBy").attr("required", "true");

        $("input[required],select[required],textarea[required]").each(
          function () {
            $(this)
              .prev("label")
              .append('<span class="required" style="color: red;">*</span>');
          }
        );
      }

      $("#timeSheetModal").modal("show");
      $("#Save").hide();
      $("#Update").show();
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function Update() {
  // debugger;
  var isValid = true;

  var existingData = {
    Date: $("#inputDate").val(),
    Activity: $("#activity").val(),
    Flag: $("#flag").val(),
    Category: $("#category").val(),
    Status: $("#status").val(),
    KnownBy: $("#knownBy").val(),
  };

  var initialData = {
    Date: $("#inputDate").attr("data-initial"),
    Activity: $("#activity").attr("data-initial"),
    Flag: $("#flag").attr("data-initial"),
    Category: $("#category").attr("data-initial"),
    Status: $("#status").attr("data-initial"),
    KnownBy: $("#knownBy").attr("data-initial"),
  };

  initialData.Date = initialData.Date.replace("T00:00:00", "");

  var hasChanged = JSON.stringify(existingData) !== JSON.stringify(initialData);

  console.log("Has data changed:", hasChanged);
  console.log("existingData:", existingData);
  console.log("initialData:", initialData);

  if (!hasChanged) {
    Swal.fire({
      icon: "info",
      title: "No Changes Detected",
      text: "No data has been modified.",
      showConfirmButton: false,
      timer: 2000,
    });
    $("#timeSheetModal").modal("hide");
    return;
  }

  $("input[required],select[required],textarea[required]").each(function () {
    var input = $(this);
    if (!input.val()) {
      input.next(".error-message").show();
      isValid = false;
    } else {
      input.next(".error-message").hide();
    }
  });

  if (!isValid) {
    return;
  }

  if (!validateName) {
    $("#knownBy").focus();
    $("#knownBy").next(".error-message").show();
    return;
  }

  var TimeSheet = new Object();
  TimeSheet.Id = $("#timeSheetId").val();
  TimeSheet.Date = $("#inputDate").val();
  TimeSheet.Activity = $("#activity").val();
  TimeSheet.Flag = $("#flag").val();
  TimeSheet.Category = $("#category").val();
  TimeSheet.Status = $("#status").val();
  TimeSheet.KnownBy = $("#knownBy").val();
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  TimeSheet.accountId = accid;

  console.log(TimeSheet);
  // debugger;
  $.ajax({
    url:
      "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" +
      accid,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var obj = result.data;
      if (obj && obj.length > 0) {
        var lastData = obj[0];
        TimeSheet.PlacementStatusId = lastData.placementStatusId;
      } else {
        console.log("Tidak ada data");
      }
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });

  $.ajax({
    url: "https://localhost:7177/api/TimeSheet/Update",
    type: "PUT",
    data: JSON.stringify(TimeSheet),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    // debugger;
    if (result.status == 200) {
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Data has been update!",
        showConfirmButton: false,
        timer: 1500,
      });
      $("#timeSheetModal").modal("hide");
      table.ajax.reload();
        addRowHoliday();
        addRowApproval();
    } else if (result.status == 400) {
      Swal.fire({
        icon: "warning",
        title: "Failed",
        text: "Flag with the same date can't be the same!",
        showConfirmButton: true,
      });
    } else {
      Swal.fire("Error!", "Your failed to update", "error");
      table.ajax.reload();
    }
    table.columns.adjust().draw();
  });
}

function save() {
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;

  var isValid = true;

  if (!validateName) {
    $("#knownBy").focus();
    $("#knownBy").next(".error-message").show();
    return;
  }

  $("input[required], textarea[required], select[required]").each(function () {
    var element = $(this);
    if (!element.val()) {
      element.next(".error-message").text("This field is required!").show();
      isValid = false;
    } else {
      element.next(".error-message").hide();
    }
  });

  if (!isValid) {
    return;
  }

  var TimeSheet = new Object();
  TimeSheet.Date = $("#inputDate").val();
  TimeSheet.Flag = $("#flag").val();
  TimeSheet.AccountId = accid;
  TimeSheet.PlacementStatusId = $("#lastPlacementId").val();
  TimeSheet.KnownBy = $("#knownBy").val();

    if ($("#flag").val() == "Sick" || $("#flag").val() == "Leave") {
        TimeSheet.Activity = "";
        TimeSheet.Category = "";
        TimeSheet.Status = "";
    } else {
        TimeSheet.Activity = $("#activity").val();
        TimeSheet.Category = $("#category").val();
        TimeSheet.Status = $("#status").val();
    }
    debugger;
    // Checking if the day is Saturday or Sunday
    var dayOfWeek = new Date(TimeSheet.Date).getDay();
    // Cek jika hari ini adalah Sabtu (6) atau Minggu (0)
    if (dayOfWeek === 6 || dayOfWeek === 0) {
        // If it's Saturday or Sunday, set statusApproval to "On Progress"
        TimeSheet.statusApproval = "On Progress";
        console.log(TimeSheet);
        // Send data to the Approval endpoint
        $.ajax({
            type: "POST",
            url: "https://localhost:7177/api/Approval",
            data: JSON.stringify(TimeSheet),
            contentType: "application/json; charset=utf-8",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            success: function (response) {
                if (response.status === 200) {
                    location.reload();
                    Swal.fire({
                        icon: "success",
                        title: "Data overtime has been added!",
                        timer: 2500,
                        html:
                            TimeSheet.statusApproval = "On Progress"
                                ? "Please wait for the admin to approve the overtime request"
                                : "",
                        showConfirmButton: true,
                    });
                    $("#timeSheetModal").modal("hide");
                    /*table.ajax.reload();*/
                    
                    addRowHoliday();
                    addRowApproval();
                }
            },
            error: function (error) {
                Swal.fire({
                    icon: "warning",
                    title: "Failed",
                    text: "Cannot add a overtime",
                    showConfirmButton: true,
                });
                $("#timeSheetModal").modal("hide");
                table.ajax.reload();
                addRowHoliday();
            },
        });
    } else {
        // If it's not Saturday or Sunday, send data to the original endpoint
        $.ajax({
            type: "POST",
            url: "https://localhost:7177/api/TimeSheet/AddTimeSheet",
            data: JSON.stringify(TimeSheet),
            contentType: "application/json; charset=utf-8",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            success: function (response) {
                if (response.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Data has been added!",
                        timer: 2500,
                        html:
                            TimeSheet.Flag === "Sick"
                                ? "Please send sick note to this email <a href='mailto:ras_mgmt@berca.co.id'>ras_mgmt@berca.co.id</a>"
                                : "",
                        showConfirmButton: true,
                    });
                    $("#timeSheetModal").modal("hide");
                    table.ajax.reload();
                    addRowHoliday();
                    addRowApproval();
                } else if (response.status === 400) {
                    Swal.fire({
                        icon: "warning",
                        title: "Failed",
                        text: "Flag with the same date can't be the same!",
                        showConfirmButton: true,
                    });
                    // $("#timeSheetModal").modal("hide");
                    // table.ajax.reload();
                } else if (response.status === 406) {
                    Swal.fire({
                        icon: "warning",
                        title: "Failed",
                        text: "Can't add activities to Sick or Leave flags!",
                        showConfirmButton: true,
                    });
                    // $("#timeSheetModal").modal("hide");
                    // table.ajax.reload();
                } else if (response.status === 404) {
                    Swal.fire({
                        icon: "warning",
                        title: "Failed",
                        text: "Cannot add a timesheet, the placement field is null.",
                        showConfirmButton: true,
                    });
                    $("#timeSheetModal").modal("hide");
                    table.ajax.reload();
                }
                table.columns.adjust().draw();
            },
            error: function (error) {
                Swal.fire({
                    icon: "warning",
                    title: "Failed",
                    text: "Cannot add a timesheet, the placement field is null.",
                    showConfirmButton: true,
                });
                $("#timeSheetModal").modal("hide");
                table.ajax.reload();
            },
        });
    }
}

function clearScreen() {
  $("#activity").val("");
  $(".error-message").hide();

  $("#activity").removeAttr("disabled");
  $("#category").removeAttr("disabled");
  $("#status").removeAttr("disabled");
  $("#knownBy").removeAttr("disabled");

  $("#detail-activity").show();
  $("#inputDate").prop("disabled", false);
  $("#flag").prop("disabled", false);

  $("#flag").val("WFO").trigger("change");
  document.getElementById("category").selectedIndex = 0;
  document.getElementById("status").selectedIndex = 0;
  document.getElementById("inputDate").value = new Date()
    .toISOString()
    .split("T")[0];

  $("#knownBy").val("");

  $("#Update").hide();
  $("#Save").show();
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}