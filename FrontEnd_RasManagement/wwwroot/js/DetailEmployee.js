﻿var compare = {};
var position = null;
//Set Focus on Input Search component Select2
$(document).on("select2:open", (e) => {
  const selectId = e.target.id;

  $(
    ".select2-search__field[aria-controls='select2-" + selectId + "-results']"
  ).each(function (key, value) {
    value.focus();
  });
});

$(document).ready(function () {
  var objDataToken = parseJwt(sessionStorage.getItem("Token"));
  // document.getElementById("jobRole").selectedindex = "0";
    //function position

    $(document).on('select2:open', () => {
        document.querySelector('.select2-search__field').focus();
    });

    $("#positionEmp").select2({
        placeholder: "Choose Position",
        tags: true,
        dropdownParent: '#modalContract',
        width: "100%",
        height: "100%",
    });

  if (objDataToken.RoleId == 7) {
    $(".add-new-placement").hide();
    $(".editemp-placement").hide();
    }

    $("select[requiredContract]").each(function () {
        $(this).prev("label").append('<span style="color: red;">*</span>');
    });

    document.getElementById("backButton").addEventListener("click", function () {
       
        window.location.href = "/ManageEmployee/Index";
      
  });

  document.getElementById("startDate").min = new Date()
    .toISOString()
    .split("T")[0];

  document.getElementById("endDate").min = new Date()
    .toISOString()
    .split("T")[0];

  $("#startDate").on("change", function () {
    document.getElementById("endDate").min = new Date(this.value)
      .toISOString()
      .split("T")[0];
  });

  document.getElementById("endDate").addEventListener("change", function (e) {
    if (e.target.value < $("#startDate").val()) {
      $("#Update").addClass("disabled");
      return;
    } else {
      $("#Update").removeClass("disabled");
    }
  });

  placement();
  getClient();

  $("#companyName_").on("change", function () {

    $("#jobRole").removeAttr("disabled");
    getPositionByClient(this.value);

  });
});

function placement() {
  var objDataToken = parseJwt(sessionStorage.getItem("Token"));

  var hideEditIcon = objDataToken.RoleId == 7; // true if RoleId is 7 (Manager)

  var urlParams = new URLSearchParams(window.location.search);
    var accountId = urlParams.get("accountId");

  $.ajax({
    url:
      "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" +
      accountId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var placements = result.data;

      const options = { day: "numeric", month: "long", year: "numeric" };

      for (var i = 0; i < placements.length; i++) {
        var placement = placements[i];
        var startDate_ = new Date(placement.startDate);
        var endDate = "";
        if (placement.endDate != null) {
          var endDate_ = new Date(placement.endDate);
          endDate = endDate_.toLocaleDateString("id-ID", options);
        }

        const startDate = startDate_.toLocaleDateString("id-ID", options);

        // Buat elemen baru untuk setiap data placement
        var placementElement = document.createElement("div");
        placementElement.innerHTML = `
                     <div class="card-header py-2 d-flex">
                        <span class="text-primary h-6 ">Placement Status : ${
                          placement.placementStatus
                        }<span id="fullName" class="text-dark"></span> </span>
                        <span class="ml-auto">
                            <!-- Button trigger modal -->
                           
                                <button class="btn btn-sm  pl-1 pr-1 pt-0 pb-0 ${
                                  hideEditIcon ? "d-none" : ""
                                }" style="background-color:#624DE3;" data-toggle="modal" data-target="#modalPlacement" onclick="GetById('${
          placement.accountId
        }','${placement.placementStatusId}')">
                                    <i class="fas fa-edit text-light editemp-placement"></i>
                                </button>
                        
                    
                    </span>
                </div>
                <div class="card-body m-0 pt-2" id="placementData">
                    <div class="row">
                        <div class="col" style="color: black">Company Name </div>
                        <div class="col-10" id="companyName">: ${
                          placement.client.nameOfClient
                        }</div>
                    </div>
                    <div class="row">
                        <div class="col" style="color: black">Job Role </div>
                        <div class="col-10">: ${
                          placement.position.positionClient
                        } </div>
                    </div>
                    <div class="row">
                        <div class="col" style="color: black">Start Date </div>
                        <div class="col-10">: ${startDate}</div>
                    </div>  
                    <div class="row">
                        <div class="col" style="color: black">End Date </div>
                        <div class="col-10">: ${endDate} </div>
                    </div>
                    <div class="row">
                        <div class="col  " style="color: black">Description </div>
                        <div class="col-10">: ${placement.description} </div>
                    </div>
                    <div class="row">
                        <div class="col  " style="color: black">PIC Name</div>
                        <div class="col-10">: ${placement.picName} </div>
                    </div>
                    `;
        // Tambahkan elemen placement ke div dengan id "placementData"
        document.getElementById("placementData").appendChild(placementElement);
      }
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
  // getCompany();
}

function GetById(accountId, placementStatusId) {
  //debugger;
  const startDate = document.getElementById("showStartDate");
  const endDate = document.getElementById("showEndDate");
  startDate.style.display = "none";
  endDate.style.display = "block";

  var accountId = accountId;
  $.ajax({
    type: "GET",
    url:
      "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" +
      accountId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    async: true,
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    $("#modal-add").modal("hide");
    $("#modal-add").on("hidden.bs.modal", function () {
      $(this).data("bs.modal", null);
    });

    var objArray = result.data; //data yg didapat dari api

    // Melakukan filter berdasarkan placementStatusId
    var obj = objArray.find(
      (item) => item.placementStatusId == placementStatusId
    );

    // Konversi string tanggal menjadi objek Date
    var startDate = new Date(obj.startDate);
    var endDate = "";

    // Fungsi untuk memformat tanggal menjadi "yyyy-MM-dd" (format yang diharapkan input date)
    function formatDate(date) {
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString().padStart(2, "0");
      var day = date.getDate().toString().padStart(2, "0");
      return year + "-" + month + "-" + day;
    }

    if (obj.endDate != null) {
      var endDate_ = new Date(obj.endDate);
      endDate = formatDate(endDate_);
    }

    document.getElementById("endDate").min = new Date(startDate)
      .toISOString()
      .split("T")[0];

    $("#placementStatusId").val(placementStatusId);
    $("#companyName_").val(obj.clientId).trigger("change");
    $("#picName").val(obj.picName);

    position = obj.positionId;
    getPosition(obj.clientId);
    //$("#jobRole").val(obj.jobRole);
    $("#startDate").val(formatDate(startDate));
    $("#endDate").val(endDate);
    $("#description").val(obj.description);
    $('input[name="status"][value="' + obj.placementStatus + '"]').prop(
      "checked",
      true
    );
    $("#Update").show();
    $("#Add").hide();

    compare = {
      PicName: obj.picName,
      PlacementStatus: obj.placementStatus,
      ClientId: obj.clientId,
      Description: obj.description,
      EndDate: endDate,
      PositionId: obj.positionId,
    };
  });
}

function getClient() {
  var selectClient = document.getElementById("companyName_");

  $.ajax({
    type: "GET",
    url: "https://localhost:7177/api/ClientName",
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    if (result != null) {
      result.data.forEach((item) => {
        var option = new Option(
          item.nameOfClient + " ( " + item.salesName + " )",
          item.id,
          true,
          false
        );
        selectClient.add(option);
      });
    }
  });

  $("#companyName_").select2({
    placeholder: "Choose Client",
    dropdownParent: $("#modalPlacement"),
    width: "100%",
    height: "100%",
    allowClear: false,
    tags: true,
  });
}


function getPositionByClient(idClient) {

  var selectPosition = document.getElementById("jobRole");
  if (position == null) {
    $.ajax({
      type: "GET",
      url:
        "https://localhost:7177/api/Position/byClientId?clientId=" + idClient,
      contentType: "application/json; charset=utf-8",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
    }).then((result) => {
      if (result != null) {
        $("#jobRole").empty();
        $("#jobRole").append(`<option selected disabled>
        Choose Position
      </option>`);
    
        // var data = result.data.filter((element) => element.status == "Open");
        result.data.forEach((item) => {
          var option = new Option(
            item.positionClient + " (" + item.level + ")",
            item.id,
            true,
            false
          );
          selectPosition.add(option);
        });
        $("#jobRole").val(position).trigger("change");
      }
    });
  } else {
    $.ajax({
      type: "GET",
      url:
        "https://localhost:7177/api/Position/byClientId?clientId=" + idClient,
      contentType: "application/json; charset=utf-8",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
    }).then((result) => {
      if (result != null) {
        $("#jobRole").empty();
        $("#jobRole").append(`<option selected disabled>
        Choose Position
      </option>`);
        result.data.forEach((item) => {
          var option = new Option(
            item.positionClient + " (" + item.level + ")",
            item.id,
            true,
            false
          );
          selectPosition.add(option);
        });
        $("#jobRole").val(position).trigger("change");
      }
    });
  }
}
