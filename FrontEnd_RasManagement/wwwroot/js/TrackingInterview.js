var table = null;
var position = null;

$(document).ready(function () {
  $("#Update").hide();
  $("#btnNewProcess").hide();
  table = $("#trackingIntvw").DataTable({
    fixedColumns: {
      leftColumns: window.innerWidth > 1024 ? 2 : null,
    },
    fixedHeader: true,
    scrollX: true,
    searchable: true,
    ajax: {
      url: "https://localhost:7177/api/Tracking/Interview", // Your API endpoint
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
        data: null,
        render: function (data, type, row, meta) {
          var emp = row.fullnameEmployee;
          var nonras = row.fullnameNonRAS;

          if (type === "display" || type === "filter") {
            if (emp != null) {
              var icon =
                '<div class="row"><div class="col-4 text-left mr-5">' +
                emp +
                '</div><div class="col text-right"><i class="fas fa-external-link-alt edit" style="color: #ff0000;  visibility: hidden;" onclick="return GetById(\'' +
                row.id +
                "')\"></i>";
            } else {
              var icon =
                '<div class="row"><div class="col-4 text-left mr-5">' +
                nonras +
                '</div><div class="col text-right"><i class="fas fa-external-link-alt edit" style="color: #ff0000;  visibility: hidden;" onclick="return GetById(\'' +
                row.id +
                "')\"></i>";
            }

            // Inisialisasi variabel yang akan menyimpan kode HTML checkbox

            $(document).on("mouseover", ".row", function () {
              $(this).find("i.edit").css("visibility", "visible");
            });

            $(document).on("mouseout", ".row", function () {
              $(this).find("i.edit").css("visibility", "hidden");
            });
            var expand = icon;
            return expand;
          }

          // Untuk tipe data lain, kembalikan data aslinya
          return data;
        },
      },
      { data: "position" },
      { data: "client" },
      {
        data: "intStatus",
        render: function (data, type, row) {
          const intStatusArray = row.intStatus.split("<br>");

          // Membuat objek untuk menyimpan data
          const userData = { statusArray: [] };

          // Mengumpulkan data status
          for (let i = 0; i < intStatusArray.length; i++) {
            // Menambahkan status ke dalam array yang sesuai
            userData.statusArray.push(intStatusArray[i]);
          }

          // Menampilkan data terakhir
          const lastStatus =
            userData.statusArray[userData.statusArray.length - 1];

          return lastStatus;
        },
      },
      {
        data: "intDate",
        render: function (data, type, row) {
          const intDateArray = row.intDate.split("<br>");

          // Membuat objek untuk menyimpan data
          const userData = { DateArray: [] };

          // Mengumpulkan data Date
          for (let i = 0; i < intDateArray.length; i++) {
            // Menambahkan Date ke dalam array yang sesuai
            userData.DateArray.push(intDateArray[i]);
          }

          // Menampilkan data terakhir
          const lastDate = userData.DateArray[userData.DateArray.length - 1];

          return lastDate;
        },
      },
      {
        data: "notes",
      },
    ],
    order: [[1, "desc"]],
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

  getResource();
  getClient();
  fetchCategories();

  $("#client").on("change", function () {
    $("#position").removeAttr("disabled");
    getPosition(this.value);
  });
});

function getResource() {
  var selectResource = document.getElementById("resource");

  $.ajax({
    type: "GET",
    url: "https://localhost:7177/api/Employees",
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    if (result != null) {
      result.data.forEach((item) => {
        var option = new Option(
          "RAS - " + item.fullname,
          "RAS," + item.accountId,
          true,
          false
        );
        selectResource.add(option);
      });
    }
  });

  $.ajax({
    type: "GET",
    url: "https://localhost:7177/api/Shortlist",
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    if (result != null) {
      result.data.forEach((item) => {
        var option = new Option(
          "Non RAS - " + item.fullname,
          "NON," + item.nonRasId,
          true,
          false
        );
        selectResource.add(option);
      });
    }
  });
  $("#resource").select2({
    placeholder: "Select Resource",
    width: "100%",
    height: "100%",
    allowClear: true,
    tags: true,
  });
}

function getClient() {
  var selectClient = document.getElementById("client");

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
        var option = new Option(item.nameOfClient, item.id, true, false);
        selectClient.add(option);
      });
    }
  });

  $("#client").select2({
    placeholder: "Choose Client",
    width: "100%",
    height: "100%",
    allowClear: true,
    tags: true,
  });
}

function getPosition(idClient) {
  var selectPosition = document.getElementById("position");

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
        $("#position").empty();
        $("#position").append(`<option selected disabled>
        Choose Position
      </option>`);
        result.data.forEach((item) => {
          var option = new Option(item.positionClient, item.id, true, false);
          selectPosition.add(option);
        });
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
        $("#position").empty();
        $("#position").append(`<option selected disabled>
        Choose Position
      </option>`);
        result.data.forEach((item) => {
          var option = new Option(item.positionClient, item.id, true, false);
          selectPosition.add(option);
        });
        $("#position").val(position).trigger("change");
      }
    });
  }
}

function clearScreen() {
  position = null;
  $(".process").remove();
  $("#position").empty();
  $("#position").append(`<option selected disabled>Choose Position</option>`);
  clearProcess();

  $("#resource").select2("val", $("#resource option:eq(0)").val());
  $("#client").select2("val", $("#client option:eq(0)").val());

  document.getElementById("position").selectedIndex = "0";
  document.getElementById("intStatus").selectedIndex = "0";

  $("#intDate").val("");
  $("#notes").val("");

  $("#Save").show();
  $("#Update").hide();
}

function Save() {
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;

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

  var TrackingInterview = new Object();

  var resource = $("#resource").val();
  if (resource.split(",")[0] === "RAS") {
    TrackingInterview.accountId = resource.split(",")[1];
  } else {
    TrackingInterview.nonRasId = resource.split(",")[1];
  }

  TrackingInterview.clientId = $("#client").val();
  TrackingInterview.positionId = $("#position").val();
  TrackingInterview.intvwDate = $("#intDate").val();
  TrackingInterview.intvwStatus = $("#intStatus").val();
  TrackingInterview.notes = $("#notes").val();

  var candidateName = $("#resource option:selected").text();
  if (candidateName.substr(0, 3) == "RAS") {
    candidateName = candidateName.substr(6);
  } else {
    candidateName = candidateName.substr(10);
  }

  $.ajax({
    type: "POST",
    url: "https://localhost:7177/api/Tracking",
    data: JSON.stringify(TrackingInterview),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    if (result.status == 200) {
      const logMessage = `Has added tracking interview for ${candidateName}`;
      SaveLogUpdate(logMessage);

      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Data has been added!",
        showConfirmButtom: false,
        timer: 1500,
      });
      $("#trackingModal").modal("hide");
      table.ajax.reload();
      clearScreen();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Data failed to added!",
        showConfirmButtom: false,
        timer: 1500,
      });
      $("#trackingModal").modal("hide");
      table.ajax.reload();
    }
  });
}

function GetById(trackingId) {
  $("#btnNewProcess").show();

  $.ajax({
    url: "https://localhost:7177/api/Tracking/" + trackingId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      //debugger;
      var obj = result.data; //data yg dapet dr id

      $("#trackingId").val(obj.id);
      if (obj.accountId != null) {
        $("#resource")
          .val("RAS," + obj.accountId)
          .trigger("change");
      } else {
        $("#resource")
          .val("NON," + obj.nonRasId)
          .trigger("change");
      }
      $("#client").val(obj.clientId).trigger("change");
      position = obj.positionId;
      getPosition(obj.clientId);

      const intDateArray = obj.intvwDate.split("<br>");
      const intStatusArray = obj.intvwStatus.split("<br>");

      setProcess(intDateArray.length - 1);

      var elementDate = document.getElementsByClassName("intDate");
      var elementStatus = document.getElementsByClassName("intStatus");

      for (let i = 0; i < intDateArray.length; i++) {
        elementDate[i].value = new Date(intDateArray[i])
          .toISOString()
          .slice(0, 10);
      }

      for (let i = 0; i < intStatusArray.length; i++) {
        elementStatus[i].value = intStatusArray[i];
      }

      // const intDate = new Date(obj.intvwDate).toISOString().slice(0, 10);

      // $("#intDate").val(intDate);
      // $("#intStatus").val(obj.intvwStatus).trigger("change");
      $("#notes").val(obj.notes);

      $("#trackingModal").modal("show");
      $("#Save").hide();
      $("#Update").show();
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function Update() {
  debugger;
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

  var intDateArray = document.getElementsByClassName("intDate");
  var intStatusArray = document.getElementsByClassName("intStatus");

  var intDate = "";
  var intStatus = "";
  for (var i = 0; i < intDateArray.length; i += 1) {
    intDate += intDateArray[i].value + "<br>";
  }

  for (var i = 0; i < intStatusArray.length; i += 1) {
    intStatus += intStatusArray[i].value + "<br>";
  }

  var TrackingInterview = new Object();

  var resource = $("#resource").val();
  if (resource.split(",")[0] === "RAS") {
    TrackingInterview.accountId = resource.split(",")[1];
  } else {
    TrackingInterview.nonRasId = resource.split(",")[1];
  }

  TrackingInterview.id = $("#trackingId").val();
  TrackingInterview.clientId = $("#client").val();
  TrackingInterview.positionId = $("#position").val();
  TrackingInterview.intvwDate = intDate.substr(0, intDate.length - 4);
  TrackingInterview.intvwStatus = intStatus.substr(0, intStatus.length - 4);
  TrackingInterview.notes = $("#notes").val();

  var candidateName = $("#resource option:selected").text();
  if (candidateName.substr(0, 3) == "RAS") {
    candidateName = candidateName.substr(6);
  } else {
    candidateName = candidateName.substr(10);
  }

  $.ajax({
    type: "PUT",
    url: "https://localhost:7177/api/Tracking",
    data: JSON.stringify(TrackingInterview),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    if (result.status == 200) {
      const logMessage = `Has added tracking interview for ${candidateName}`;
      SaveLogUpdate(logMessage);

      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Data has been added!",
        showConfirmButtom: false,
        timer: 1500,
      });
      $("#trackingModal").modal("hide");
      table.ajax.reload();
      clearScreen();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Data failed to added!",
        showConfirmButtom: false,
        timer: 1500,
      });
      $("#trackingModal").modal("hide");
      table.ajax.reload();
    }
  });
}

function newProcess() {
  $("#process").append(`<div class="row mb-2 process">
                            <div class="col">
                                <input class="form-control form-control-sm intDate" type="date" id="intDate" required>
                                <span class="error-message" style="color: red; display: none;">This field is required!</span>
                            </div>
                            <div class="col">
                                <select class=" form-control form-control-sm intStatus" id="intStatus" >
                                        <option selected disabled>Choose...</option>
                                        <option value="Submitted CV">Submitted CV</option>
                                        <option value="Hold">Hold</option>
                                        <option value="Scheduling">Scheduling</option>
                                        <option value="Technical Test">Technical Test</option>
                                        <option value="Done">Done</option>
                                        <option value="Reject">Reject</option>
                                    </select>
                                <span class="error-message" style="color: red; display: none;">This field is required!</span>
                            </div>
                        </div>`);
}

function setProcess(length) {
  for (let i = 0; i < length; i++) {
    $("#process").append(`<div class="row mb-2 process">
                            <div class="col">
                                <input class="form-control form-control-sm intDate" type="date" id="intDate" required>
                                <span class="error-message" style="color: red; display: none;">This field is required!</span>
                            </div>
                            <div class="col">
                                <select class=" form-control form-control-sm intStatus" id="intStatus" >
                                        <option selected disabled>Choose...</option>
                                        <option value="Submitted CV">Submitted CV</option>
                                        <option value="Hold">Hold</option>
                                        <option value="Scheduling">Scheduling</option>
                                        <option value="Technical Test">Technical Test</option>
                                        <option value="Done">Done</option>
                                        <option value="Reject">Reject</option>
                                    </select>
                                <span class="error-message" style="color: red; display: none;">This field is required!</span>
                            </div>
                        </div>`);
  }
}

function clearProcess() {
  $("#process").append(`<div class="row mb-2 process">
                            <div class="col">
                                <label for="message-text" class="col-form-label">Interview Date</label>                            
                                <input class="form-control form-control-sm intDate" type="date" id="intDate" required>
                                <span class="error-message" style="color: red; display: none;">This field is required!</span>
                            </div>
                            <div class="col">
                                <label for="message-text" class="col-form-label">Interview Status</label>
                                <button type="button" id="btnNewProcess" class="btn btn-sm btn-outline-info float-right" style="height: 45%;" onclick="newProcess();">+ New </button>
                                <select class=" form-control form-control-sm intStatus" id="intStatus" >
                                        <option selected disabled>Choose...</option>
                                        <option value="Submitted CV">Submitted CV</option>
                                        <option value="Hold">Hold</option>
                                        <option value="Scheduling">Scheduling</option>
                                        <option value="Technical Test">Technical Test</option>
                                        <option value="Done">Done</option>
                                        <option value="Reject">Reject</option>
                                    </select>
                                <span class="error-message" style="color: red; display: none;">This field is required!</span>
                            </div>
                        </div>
                    </div>`);

  var btnSave = $("#Save").css("display");
  if (btnSave == "block") {
    $("#btnNewProcess").hide();
  }
}

function fetchCategories() {
  fetch("https://localhost:7177/api/ClientName", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      // Memanggil fungsi untuk membuat navigasi berdasarkan data yang diterima

      createNavigation(result.data);
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}

function createNavigation(categories) {
  let maxVisibleCategories = 9;
  categories.unshift({ id: 0, nameOfClient: "All" }); // Menambahkan opsi "All" ke dalam array categories

  // Mendeteksi lebar layar saat halaman dimuat
  const screenWidth = window.innerWidth || document.documentElement.clientWidth;

  // Ubah jumlah maksimum kategori yang ditampilkan berdasarkan lebar layar
  if (screenWidth <= 1024) {
    maxVisibleCategories = 9;
  }
  if (screenWidth < 850) {
    maxVisibleCategories = 7;
  }
  if (screenWidth < 750) {
    maxVisibleCategories = 5;
  }
  if (screenWidth <= 500) {
    maxVisibleCategories = 3;
  }
  const navList = document.createElement("ul");
  navList.className = "nav nav-tabs";

  // Loop untuk menambahkan item navigasi sampai index 6 (item ke-7)
  for (let i = 0; i < Math.min(categories.length, maxVisibleCategories); i++) {
    const listItem = document.createElement("li");
    listItem.className = "nav-item";

    const link = document.createElement("a");
    link.className = "nav-link text-sm";
    link.href = "#";
    link.setAttribute(
      "data-category",
      categories[i].nameOfClient.toLowerCase()
    );
    link.textContent = categories[i].nameOfClient;

    if (i === 0) {
      // Tandai 'All' sebagai aktif secara default
      link.classList.add("active");
    }

    listItem.appendChild(link);

    navList.appendChild(listItem);

    // Tambahkan event listener untuk setiap link kategori
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const selectedCategory = this.getAttribute("data-category");

      if (selectedCategory == "all") {
        table.columns().search("").draw();
      } else {
        table.column(3).search(selectedCategory).draw();
      }

      navList.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active");
      });

      this.classList.add("active");
    });
  }

  const filterNavigation = document.getElementById("filterNavigation");

  // Dropdown untuk menyimpan sisa kategori setelah ke-7

  if (categories.length > maxVisibleCategories) {
    const dropdownContainer = createDropdown(
      categories.slice(maxVisibleCategories)
    );
    navList.appendChild(dropdownContainer);

    dropdownToggle = dropdownContainer.querySelector(".dropdown-toggle");

    dropdownToggle.addEventListener("click", function () {
      const navLinks = navList.querySelectorAll(".nav-link");
      navLinks.forEach((link) => {
        link.classList.remove("active");
      });
      dropdownToggle.classList.add("active");
    });
  }

  // Tambahkan elemen dropdown ke akhir dari list navigasi
  filterNavigation.appendChild(navList);
}

// Fungsi untuk membuat dropdown
function createDropdown(categories) {
  const dropdownContainer = document.createElement("li");
  dropdownContainer.className = "nav-item dropdown ml-auto"; // Untuk mengatur ke kanan (ml-auto)

  const dropdownToggle = document.createElement("a");
  dropdownToggle.className = "nav-link dropdown-toggle";
  dropdownToggle.href = "#";
  dropdownToggle.setAttribute("id", "navbarDropdown");
  dropdownToggle.setAttribute("role", "button");
  dropdownToggle.setAttribute("data-toggle", "dropdown");
  dropdownToggle.setAttribute("aria-haspopup", "true");
  dropdownToggle.setAttribute("aria-expanded", "false");
  dropdownToggle.textContent = "More";

  const dropdownMenu = document.createElement("div");
  dropdownMenu.className = "dropdown-menu";
  dropdownMenu.setAttribute("aria-labelledby", "navbarDropdown");

  for (let i = 0; i < categories.length; i++) {
    const dropdownItem = document.createElement("a");
    dropdownItem.className = "dropdown-item";
    dropdownItem.href = "#";
    dropdownItem.textContent = categories[i].nameOfClient;

    dropdownItem.addEventListener("click", function (e) {
      e.preventDefault();
      const selectedCategory = this.textContent;
      if (selectedCategory == "all") {
        table.search("").draw();
      } else {
        table.column(3).search(selectedCategory).draw();
      }
    });

    dropdownMenu.appendChild(dropdownItem);
  }

  dropdownContainer.appendChild(dropdownToggle);
  dropdownContainer.appendChild(dropdownMenu);

  return dropdownContainer;
}
