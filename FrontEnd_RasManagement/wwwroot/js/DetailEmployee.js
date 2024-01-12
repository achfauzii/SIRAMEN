$(document).ready(function () {
  document.getElementById("backButton").addEventListener("click", function () {
    history.back();
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
});

function placement() {
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
      var placements = result.data; //data yg didapat dari api

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
                    <span class="text-primary h-6 ">Placement Status : ${placement.placementStatus}<span id="fullName" class="text-dark"></span> </span>
                    <span class="ml-auto">
                        <!-- Button trigger modal -->
                       
                            <button class="btn btn-sm  pl-1 pr-1 pt-0 pb-0" style="background-color:#624DE3;" data-toggle="modal" data-target="#modalPlacement" onclick="GetById('${placement.accountId}','${placement.placementStatusId}')">
                                <i class="fas fa-edit text-light"></i>
                        </button>
                    
                
                </span>
            </div>
            <div class="card-body m-0 pt-2" id="placementData">
                <div class="row">
                    <div class="col" style="color: black">Company Name </div>
                    <div class="col-10" id="companyName">: ${placement.companyName}</div>
                </div>
                <div class="row">
                    <div class="col" style="color: black">Job Role </div>
                    <div class="col-10">: ${placement.jobRole} </div>
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
        // Assuming you have an element with the id "companyName" for each placement
        //document.getElementById('companyName' + i).textContent = placement.companyName;
        // Similarly, you can update other elements for other placement properties
      }
    },

    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function GetById(accountId, placementStatusId) {
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
    $("#companyName_").val(obj.companyName);
    $("#picName").val(obj.picName);
    $("#jobRole").val(obj.jobRole);
    $("#startDate").val(formatDate(startDate));
    $("#endDate").val(endDate);
    $("#description").val(obj.description);
    $('input[name="status"][value="' + obj.placementStatus + '"]').prop(
      "checked",
      true
    );
    $("#Update").show();
    $("#Add").hide();
  });
}
