var table = null;

$(document).ready(function () {
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
      var obj = result.data;
      if (obj && obj.length > 0) {
        var lastData = obj[0];
        $("#compName").text(lastData.companyName);
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
    ajax: {
      url: "https://localhost:7177/api/TimeSheet/accountId?accountId=" + accid, // Your API endpoint
      type: "GET",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1 + ".";
        },
      },
      {
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
      {
        data: "activity",
      },
      { data: "flag" },
      {
        data: "category",
      },
      {
        data: "status",
      },
      {
        data: "knownBy",
      },
      {
        data: null,
        render: function (data, type, row) {
          return (
            '<button class="btn btn-sm btn-warning mr-2 " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return getById(' +
            row.id +
            ')"><i class="fa fa-edit"></i></button >'
          );
        },
      },
    ],
    order: [[1, "desc"]],
    columnDefs: [
      {
        targets: [0, 2, 3, 4, 5, 6, 7],
        orderable: false,
      },
      
    ],
    //Agar nomor tidak berubah
    drawCallback: function (settings) {
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
    },
  });
});

function getById(Id) {
  clearScreen();
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

      const intActivity = obj.activity.split("<br>");
      const intCategory = obj.category.split("<br>");
      const intStatus = obj.status.split("<br>");
      const intKnown = obj.knownBy.split("<br>");

      setProcess(intActivity.length - 1);
      console.log(intActivity.length);
      var elementActivity = document.getElementsByClassName("activity");
      console.log(elementActivity.length);
      for (let i = 0; i < intActivity.length; i++) {
        elementActivity[i].value = intActivity[i];
      }

      var elementCategory = document.getElementsByClassName("category");
      for (let i = 0; i < intCategory.length; i++) {
        elementCategory[i].value = intCategory[i];
      }

      var elementStatus = document.getElementsByClassName("status");
      for (let i = 0; i < intStatus.length; i++) {
        elementStatus[i].value = intStatus[i];
      }

      var elementKnown = document.getElementsByClassName("knownBy");
      for (let i = 0; i < intKnown.length; i++) {
        elementKnown[i].value = intKnown[i];
      }

      $("#timeSheetId").val(obj.id); //ngambil data dr api
      $("#lastPlacementId").val(obj.placementStatusId);
      const date = formatDate(obj.date);
      $("#inputDate").val(date);
      $("#flag").val(obj.flag);
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

  var activity = "";
  var category = "";
  var status = "";
  var knownBy = "";

  var elementActivity = document.getElementsByClassName("activity");
  var elementCategory = document.getElementsByClassName("category");
  var elementStatus = document.getElementsByClassName("status");
  var elementKnown = document.getElementsByClassName("knownBy");

  for (let i = 0; i < elementActivity.length; i++) {
    activity += elementActivity[i].value + "<br>";
    category += elementCategory[i].value + "<br>";
    status += elementStatus[i].value + "<br>";
    knownBy += elementKnown[i].value + "<br>";
  }
  
  var TimeSheet = new Object();
  TimeSheet.Id = $("#timeSheetId").val();
  TimeSheet.Date = $("#inputDate").val();
  
  TimeSheet.Activity = activity.substring(0, activity.length - 4);  
  TimeSheet.Flag = $("#flag").val();
  TimeSheet.Category = category.substring(0, category.length - 4);
  TimeSheet.Status = status.substring(0, status.length - 4);
  TimeSheet.KnownBy = knownBy.substring(0, knownBy.length - 4);

  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  TimeSheet.accountId = accid;

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
    url: "https://localhost:7177/api/TimeSheet",
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

  //Activity Input
  var intActivityArray = document.getElementsByClassName("activity");
  var intActivity = "";
  for (var i = 0; i < intActivityArray.length; i += 1) {
    intActivity += intActivityArray[i].value + "<br>";
  }

  //Category Input
  var intCategoryArray = document.getElementsByClassName("category");
  var intCategory = "";
  for (var i = 0; i < intCategoryArray.length; i += 1) {
    intCategory += intCategoryArray[i].value + "<br>";
  }

  //Status Input
  var intStatusArray = document.getElementsByClassName("status");
  var intStatus = "";
  for (var i = 0; i < intStatusArray.length; i += 1) {
    intStatus += intStatusArray[i].value + "<br>";
  }

  //KnownBy Input
  var intKnownArray = document.getElementsByClassName("knownBy");
  var intKnown = "";
  for (var i = 0; i < intKnownArray.length; i += 1) {
    intKnown += intKnownArray[i].value + "<br>";
  }
  
  var TimeSheet = new Object();
  TimeSheet.Date = $("#inputDate").val();
  TimeSheet.Flag = $("#flag").val();
  TimeSheet.AccountId = accid;
  TimeSheet.PlacementStatusId = $("#lastPlacementId").val();
  TimeSheet.KnownBy = intKnown.substr(0, intKnown.length - 4);

  if ($("#flag").val() == "Sick" || $("#flag").val() == "Leave") {
    TimeSheet.Activity = "";
    TimeSheet.Category = "";
    TimeSheet.Status = "";
  } else {
    TimeSheet.Activity = intActivity.substr(0, intActivity.length - 4);
    TimeSheet.Category = intCategory.substr(0, intCategory.length - 4);
    TimeSheet.Status = intStatus.substr(0, intStatus.length - 4);
  }

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
          html:
            TimeSheet.Flag === "Sick"
              ? "Please send sick note to this email <a href='mailto:ras_mgmt@berca.co.id'>ras_mgmt@berca.co.id</a>"
              : "",
          showConfirmButton: true,
        });
        $("#timeSheetModal").modal("hide");
        table.ajax.reload();
      } else if (response.status === 400) {
        Swal.fire({
          icon: "warning",
          title: "Failed",
          text: "Time Sheet with the same date already exists!",
          showConfirmButton: false,
          timer: 1500,
        });
        $("#timeSheetModal").modal("hide");
        table.ajax.reload();
      } else if (response.status === 404) {
        Swal.fire({
          icon: "warning",
          title: "Failed",
          text: "Cannot add a timesheet, the placement field is null.",
          showConfirmButton: false,
          timer: 1500,
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
      table.columns.adjust().draw();
    },
  });
}

function clearScreen() {
  $(".timesheet").remove();
  clearProcess();
  $("#activity").val("");
  document.getElementById("flag").selectedIndex = "0";
  document.getElementById("category").selectedIndex = "0";
  document.getElementById("status").selectedIndex = "0";
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

function newActivity() {
  $("#div-activ").append(
    `<div class="border border-info rounded px-2 mb-2 timesheet">
                          <label for="message-text" class="col-form-label">Activity</label>
                          <textarea class="form-control mb-2 activity" placeholder="Write your activity here..." required style="height:40px; max-height: 100px"></textarea>
                          <div class="row mb-2 ">
                            <div class="col">
                                <select class="form-control form-control-sm category" required>
                                    <option selected disabled>Choose category</option>
                                    <option value="Meeting/Discussion">Meeting/Discussion</option>
                                    <option value="Coding">Coding</option>
                                    <option value="Testing">Testing</option>
                                    <option value="UAT/SIT">UAT/SIT</option>
                                    <option value="Ticketing">Ticketing</option>
                                    <option value="Docummentation">Docummentation</option>
                                    <option value="Bug/Issue Fix">Bug/Issue Fix</option>
                                    <option value="Support">Support</option>
                                    <option value="Review">Review</option>
                                    <option value="GoLive/Deploy">GoLive/Deploy</option>
                                    <option value="Others">Others</option>
                                </select>                                
                            </div>
                            <div class="col">
                                <select class="form-control form-control-sm status" required>
                                    <option selected disabled>Choose status</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Done">Done</option>
                                    <option value="Need Approval">Need Approval</option>
                                </select>                                
                            </div>
                        </div>                    

                        <div class="form-group">
                            <input class="form-control form-control-sm knownBy" type="text" placeholder="Konwn By" required>                            
                        </div></div>`
  );
}
function setProcess(length) {
  for (let i = 0; i < length; i++) {
    $("#div-activ").append(
      `<div class="border border-info rounded px-2 mb-2 timesheet">
                          <label for="message-text" class="col-form-label">Activity</label>
                          <textarea class="form-control mb-2 activity" placeholder="Write your activity here..." required style="height:40px; max-height: 100px"></textarea>
                          <div class="row mb-2 ">
                            <div class="col">
                                <select class="form-control form-control-sm category" required>
                                    <option selected disabled>Choose category</option>
                                    <option value="Meeting/Discussion">Meeting/Discussion</option>
                                    <option value="Coding">Coding</option>
                                    <option value="Testing">Testing</option>
                                    <option value="UAT/SIT">UAT/SIT</option>
                                    <option value="Ticketing">Ticketing</option>
                                    <option value="Docummentation">Docummentation</option>
                                    <option value="Bug/Issue Fix">Bug/Issue Fix</option>
                                    <option value="Support">Support</option>
                                    <option value="Review">Review</option>
                                    <option value="GoLive/Deploy">GoLive/Deploy</option>
                                    <option value="Others">Others</option>
                                </select>                                
                            </div>
                            <div class="col">
                                <select class="form-control form-control-sm status" required>
                                    <option selected disabled>Choose status</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Done">Done</option>
                                    <option value="Need Approval">Need Approval</option>
                                </select>                                
                            </div>
                        </div>                    

                        <div class="form-group">
                            <input class="form-control form-control-sm knownBy" type="text" placeholder="Konwn By" required>                            
                        </div>
                      </div>`
    );
  }
}
function clearProcess() {
  $("#div-activ")
    .append(`<div class="border border-info rounded px-2 pt-2 mb-2 timesheet"> <div class="form-group div-activity">
                              <label for="message-text" class="col-form-label">Activity </label>
                              <button type="button" id="btnNewProcess" class="btn btn-sm btn-outline-info mb-2 float-right" style="height: 45%;" onclick="newActivity();">+ New </button>
                              <textarea class="form-control mb-2 activity" id="activity" required style="height:40px; max-height: 100px" placeholder="Write your activity here..."></textarea>
                          </div>
                          <div class="row mb-2 ">
                            <div class="col">
                                <select class="form-control form-control-sm category" id="category" required>
                                    <option selected disabled>Choose category</option>
                                    <option value="Meeting/Discussion">Meeting/Discussion</option>
                                    <option value="Coding">Coding</option>
                                    <option value="Testing">Testing</option>
                                    <option value="UAT/SIT">UAT/SIT</option>
                                    <option value="Ticketing">Ticketing</option>
                                    <option value="Docummentation">Docummentation</option>
                                    <option value="Bug/Issue Fix">Bug/Issue Fix</option>
                                    <option value="Support">Support</option>
                                    <option value="Review">Review</option>
                                    <option value="GoLive/Deploy">GoLive/Deploy</option>
                                    <option value="Others">Others</option>
                                </select>                                
                            </div>
                            <div class="col">
                                <select class="form-control form-control-sm status" id="status" required>
                                    <option selected disabled>Choose status</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Done">Done</option>
                                    <option value="Need Approval">Need Approval</option>
                                </select>                                
                            </div>
                        </div>                    

                        <div class="form-group">
                            <input class="form-control form-control-sm knownBy" id="knownBy" type="text" placeholder="Konwn By" required>                            
                        </div>
                     </div>`);
}
