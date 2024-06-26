// File Department.js ini digunakan dalam menangani Manage Department pada bagian Admin
// Digunakan dalam view table department, add department, edit department , dan delete department.
// Secara keseluruhan department.js ini menangani halaman Manage Department di admin

var table = null;
$(document).ready(function () {
    $(
        "input[required]"
    ).each(function () {
        $(this).prev("label").append('<span style="color: red;">*</span>');
    });

    var objDataToken = parseJwt(sessionStorage.getItem('Token'));

    if (objDataToken.RoleId == 7) {
        $('.btn-add-department').hide();
    }


// Code berikut digunakan dalam menampilkan data department dalam bentuk data table
// Ada pada halaman Manage department pada bagian admin
  table = $("#TB_Department").DataTable({
    responsive: true,

    ajax: {
      url: "https://localhost:7177/api/Department",
      type: "GET",
      datatype: "json",
      dataSrc: "data",
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
      { data: "namaDept" },
      {
        // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
        data: null,
        render: function (data, type, row) {
          var modalId = "modal-edit-" + data.deptId;
          var deleteId = "modal-delete-" + data.deptId;
          return (
            '<button class="btn btn-sm btn-warning p-1 " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetByIdDept(' +
            row.deptId +
            ')"><i class="fa fa-edit"></i></button >' +
            "&nbsp;" +
            '<button class="btn btn-sm btn-danger p-1" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(\'' +
            row.deptId +
            "', '" +
            row.namaDept +
            "'" +
            ')"><i class="fa fa-trash"></i></button >'
          );
        },
      },
    ],

    order: [[1, "asc"]],

    //Buat ngilangin order kolom No dan Action
    columnDefs: [
      {
        targets: [0, 2],
            orderable: false,
            visible: objDataToken.RoleId != 7,
      },
    ],
    //Agar nomor tidak berubah
      drawCallback: function (settings) {
          var api = this.api();
          var rows = api.rows({ page: "current" }).nodes();
          var currentPage = api.page.info().page; // Mendapatkan nomor halaman saat ini
          var startNumber = currentPage * api.page.info().length + 1; // Menghitung nomor awal baris pada halaman saat ini

          api.column(0, { page: "current" })
              .nodes()
              .each(function (cell, i) {
                  cell.innerHTML = startNumber + i; // Mengupdate nomor baris pada setiap halaman
              });
      },
  });
});


// Function berikut digunakan untuk menyimpan data department baru dengan mengirim data ke server
// Function berjalan ketika admin klik save pada form Add new Department
function Save() {
  table = $("#TB_Department").DataTable();
  var isValid = true;

  $("input[required]").each(function () {
    var element = $(this);
    if (!element.val()) {
      element.next(".error-message").show();
      isValid = false;
    } else {
      element.next(".error-message").hide();
    }
  });

  if (!isValid) {
    return;
  }

  var Department = new Object(); //object baru
  Department.namaDept = $("#NamaDept").val(); //value insert dari id pada input
  $.ajax({
    type: "POST",
    url: "https://localhost:7177/api/Department/Departmentv2",
    data: JSON.stringify(Department),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },

    success: function (result) {
      const logMessage = `Has added department ${Department.namaDept}`;
      SaveLogUpdate(logMessage);
      if (result.status == 200) {
        Swal.fire({
          icon: "success",
          title: "Success...",
          text: "Data has been added!",
          showConfirmButton: false,
          timer: 1500,
        });
        $("#Modal").modal("hide");
        $("#TB_Department").DataTable().ajax.reload();
      }
    },
    error: function (xhr, status, error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        html:
          "Department <span style='text-decoration: underline; font-weight: bold;'>" +
          Department.namaDept +
          "</span> already exists",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
}

// Clearscreen department
function ClearScreen() {
  $("#DeptId").val("");
  $("#NamaDept").val("");
  $("#UpdateDept").hide();
  $("#Save").show();
  $(".error-message").hide();
}

function noHTML(input) {
  var value = input.value.replace(/<[^>]*>/g, "");
  var nohtml = value.replace(/[<>?/]/g, "");
  input.value = nohtml;
}

function handleInput(event, input) {
  // Menangani peristiwa oninput dan onpaste
  noHTML(input);
}

function ClearScreenDept() {
  $("#DeptId").val("");
  $("#NamaDept").val("");
  $(".error-message").hide();
  $("#UpdateDept").hide();
  $("#Save").show();
}


// Function ini digunakan untuk mendapatkan data department
// Menerima parameter department id, dijakankan ketika admin kelik tombol edit
// Data yang didapat ditampilkan di dalam form edit tersebut
function GetByIdDept(deptId) {
    $(".error-message").hide();
  $.ajax({
    url: "https://localhost:7177/api/Department/" + deptId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var obj = result.data; //data yg kita dapat dr API
      $("#DeptId").val(obj.deptId);
      $("#NamaDept").val(obj.namaDept);
      $("#Modal").modal("show");
      $("#UpdateDept").show();
      $("#Save").hide();
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}


// Function berikut digunakan untuk mengupdate dan mengirimkan data update ke server
// Function berjalan ketika admin klik update pada form edit department
function UpdateDept() {
  table = $("#TB_Department").DataTable();
  var isValid = true;

  $("input[required]").each(function () {
    var element = $(this);
    if (!element.val()) {
      element.next(".error-message").show();
      isValid = false;
    } else {
      element.next(".error-message").hide();
    }
  });

  if (!isValid) {
    return;
  }

  var Department = new Object(); //object baru
  Department.deptId = $("#DeptId").val();
  Department.namaDept = $("#NamaDept").val(); //value insert dari id pada input

  $.ajax({
    url: "https://localhost:7177/api/Department/Departmentv2",
    type: "PUT",
    data: JSON.stringify(Department),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      const logMessage = `Has updated the department name, department Id ${Department.deptId}`;
      SaveLogUpdate(logMessage);
      if (result.status == 200) {
        Swal.fire({
          icon: "success",
          title: "Success...",
          text: "Data has been updated!",
          showConfirmButton: false,
          timer: 1500,
        });
        $("#Modal").modal("hide");
        table.ajax.reload();
      } else if (result.status == 400) {
        Swal.fire({
          icon: "error",
          title: "Failed...",
          text: "Department Name Already Exists!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    error: function (errormessage) {
      Swal.fire({
        icon: "error",
        title: "Failed...",
        text: "Unknown",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
}


// Function ini digunakan untuk menangani delete data department
// Delete department tidak dapat dilakukan jika data department terhubung ke table lain atau ada FK di tabel lain
// Function ini menerima parameter deparemnt id untuk delete data berdasarkan id, dan department name untuk menghapus berdasarkan id
// Function berjalan ketika admin klik tombol delete
function Delete(deptId, deptName) {
  table = $("#TB_Department").DataTable();
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.value) {
      $.ajax({
        url: "https://localhost:7177/api/Department/" + deptId,
        type: "DELETE",
        dataType: "json",

        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
          const logMessage = `Has deleted department ${deptName}`;
          SaveLogUpdate(logMessage);
          Swal.fire("Deleted!", "Your data has been deleted.", "success");
          $("#TB_Department").DataTable().ajax.reload();
        },
        error: function (errormessage) {
          Swal.fire("Error!", "Cant Delete, Department Is Not Empty", "error");
        },
      });
    }
  });
}

const closeButton = document.querySelector(
  '.btn.btn-danger[data-dismiss="modal"]'
);
closeButton.addEventListener("click", function () {
  // kode untuk menutup modal
});
