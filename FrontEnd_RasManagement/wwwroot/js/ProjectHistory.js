﻿// ProjectHistory.js ini merupakan file yang menangani Data CV Prohect History Employee
// File CSHTML nya berada pada Employee -> Project History
// Beberapa code diantaranya menangani view datatable project history, Save Update, Delete dan get By Id

var table = null;
$(document).ready(function () {
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;

//View Datatable untuk data project history employee
//Data yang ditampilkan adalah Project History By Account Id Employee
  table = $("#TB_ProjectHistory").DataTable({
    responsive: true,
    ajax: {
      url:
        "https://localhost:7177/api/ProjectHistory/accountId?accountId=" +
        accid,
      type: "GET",
      datatype: "json",
      dataSrc: "data",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
    },
    pagingType: "full_numbers",
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1 + ".";
        },
      },
      { data: "projectName" },
   
      {
        data: "jobSpec",
          render: function (data, type, row) {
              if (!data) {
                  return " ";
              }
              // Split data menjadi item-item dalam daftar
              const items = data.split("• ");
              // Buat daftar HTML
              let list = "<ul>";
              for (let i = 1; i < items.length; i++) {
                  let item = items[i];
                  if (item.includes("github.com")) {
                      const url = item.match(/https?:\/\/github\.com\/[^\s]+/g);
                      if (url) {
                          const projectLink = `<a href="${url[0]}" target="_blank" style="color: blue;">${row.projectName} (Github)</a>`;
                          item = item.replace(url[0], projectLink);
                      }
                  }
                  list += `<li>${item}</li>`;
              }
              list += "</ul>";

              return list;
        },
      },
      { data: "year" },
      { data: "companyName" },
      {
        // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
        data: null,
        render: function (data, type, row) {
          var modalId = "modal-edit-" + data.projectHistoryId;
          var deleteId = "modal-delete-" + data.projectHistoryId;
            return `
            <div class="btn-group" role="group" aria-label="Action buttons">
                <button class="btn btn-sm btn-warning action-button edit-button" data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(${row.projectHistoryId})"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-danger action-button delete-button" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(${row.projectHistoryId})"><i class="fa fa-trash"></i></button>
            </div>
        `;
        },
      },
    ],

    order: [[3, "desc"]],
    //"responsive": true,
    //Buat ngilangin order kolom No dan Action
    columnDefs: [
      {
        targets: [0, 2, 4, 5],
        orderable: false,
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

function generateYear(cYear) {
    const yearSelect = document.getElementById("Year");

    // Set the range of years (you can adjust the range as needed)
    const startYear = 2000;
    const endYear = new Date().getFullYear(); // Current year

    // Generate options dynamically
    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.text = year;
        if (parseInt(cYear) === year) {
            option.setAttribute('selected', true)
        }
        yearSelect.appendChild(option);
    }
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

function noHTML(input) {
  var value = input.value.replace(/<[^>]*>/g, "");
  var nohtml = value.replace(/[<>]/g, "");

 
  input.value = nohtml;
}

function handleInput(event, input) {
  // Menangani peristiwa oninput dan onpaste
  noHTML(input);
}


// Proses input pada textarea JobSpesification
// Digunakan keika meng input jobspesification untuk menambahkan bullet
$("#JobSpec").on("input", function () {
  var jobSpecValue = $(this).val();

  var lines = jobSpecValue.split("\n");

  // Memeriksa dan menghapus bullet dari setiap baris jika tidak dibutuhkan
  for (var i = 0; i < lines.length; i++) {
    // Menghapus bullet ('• ') dari awal baris jika ada
    lines[i] = lines[i].replace(/^•\s*/, "");

    // Menambahkan kembali bullet jika teks baris tidak kosong dan tidak sudah memiliki bullet
    if (lines[i].trim() !== "" && !lines[i].startsWith("• ")) {
      lines[i] = "• " + lines[i];
    }
  }

  // Menggabungkan baris-baris kembali menjadi satu teks
  var formattedJobSpec = lines.join("\n");

  // Setel nilai textarea dengan teks yang sudah diformat
  $(this).val(formattedJobSpec);
});

$("#JobSpec").on("keypress", function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    var currentValue = $(this).val();
    if (currentValue.trim() !== "") {
      // Jika teks tidak kosong, tambahkan baris baru dengan bullet
      currentValue += "\n";
      $(this).val(currentValue);
    }
  }
});


// Function Save untuk menyimpan data project history employee
// Berjalan saat employe klik save pada form add project history
function Save() {
  var isValid = true;

  $("input[required], textarea[required],select[required]").each(function () {
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

  var ProjectHistory = new Object(); //object baru
  ProjectHistory.projectName = $("#ProjectName").val(); //value insert dari id pada input
  var jobSpec = $("#JobSpec").val();
  var cleanedJobSpec = jobSpec.split('\n').map(function(line) {
    return line.trim();
  }).filter(function(line) {
    return line !== '';
  }).join('\n');
  ProjectHistory.jobSpec = cleanedJobSpec;
  ProjectHistory.year = $("#Year").val();
  ProjectHistory.companyName = $("#CompanyName").val();
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  ProjectHistory.accountId = accid;
  console.log(ProjectHistory)
  $.ajax({
    type: "POST",
    url: "https://localhost:7177/api/ProjectHistory",
    data: JSON.stringify(ProjectHistory),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    if (result.status == 200) {
      /*alert(result.message);
            $('#TB_Department').DataTable().ajax.reload();*/
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Data has been added!",
        showConfirmButtom: false,
        timer: 1500,
      });
      $("#Modal").modal("hide");
      table.ajax.reload();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Data failed to added!",
        showConfirmButtom: false,
        timer: 1500,
      });
      $("#Modal").modal("hide");
      table.ajax.reload();
    }
  });
}

// Clearscreen form project history
function ClearScreen() {
  $("#Update").hide();
  $("#Save").show();
    
    generateYear(0)
    $('#Modal').find('input, select, textarea').each(function (e) {
        $(this).val('');
        $(this).val("").trigger("change");
    })
    $(".error-message").hide()
}

// Function untuk menghandle get data berdasarkan porject history
// Function ini berjalan ketika employee klik button edit project history
// Kemudian akan menampilkan value yang di dapat pada form project history
function GetById(projectHistoryId) {
    ClearScreen()
  $.ajax({
    url: "https://localhost:7177/api/ProjectHistory/" + projectHistoryId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var obj = result.data; //data yg kita dapat dr API
        $("#ProjectHistoryId").val(obj.projectHistoryId);
        $("#ProjectName").val(obj.projectName).attr("data-initial", obj.projectName);
        $("#JobSpec").val(obj.jobSpec).attr("data-initial", obj.jobSpec);
        $("#Year").val(obj.year).trigger('change').attr("data-initial", obj.year);
        $("#CompanyName").val(obj.companyName).attr("data-initial", obj.companyName);
      $("#Modal").modal("show");
      $("#Update").show();
      $("#Save").hide();
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}


//Function update berikut untuk mengupdate data Project History Employee
//Berjalan kerika employee klik button save update pada form project history
//Kemudian akan mengirim data yang di perbaharui ke server
function Update() {
  var isValid = true;

    var existingData = {
        ProjectName: $("#ProjectName").val(),
        JobSpec: $("#JobSpec").val(),
        Year: $("#Year").val(),
        CompanyName: $("#CompanyName").val(),
    };

    var initialData = {
        ProjectName: $("#ProjectName").attr("data-initial"),
        JobSpec: $("#JobSpec").attr("data-initial"),
        Year: $("#Year").attr("data-initial"),
        CompanyName: $("#CompanyName").attr("data-initial"),
    };

    var hasChanged = JSON.stringify(existingData) !== JSON.stringify(initialData);

    console.log("Has data changed:", hasChanged);
   
    if (!hasChanged) {
        Swal.fire({
            icon: "info",
            title: "No Changes Detected",
            text: "No data has been modified.",
            showConfirmButton: false,
            timer: 2000,
        });
        $("#Modal").modal("hide");        
        return;
    }

  $("input[required], textarea[required]").each(function () {
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

  var ProjectHistory = new Object(); // New object
  ProjectHistory.projectHistoryId = $("#ProjectHistoryId").val();
  ProjectHistory.projectName = $("#ProjectName").val();
  ProjectHistory.jobSpec =  $("#JobSpec").val();
  ProjectHistory.year = $("#Year").val();
  ProjectHistory.companyName = $("#CompanyName").val();
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  ProjectHistory.accountId = accid;

  $.ajax({
    url: "https://localhost:7177/api/ProjectHistory",
    type: "PUT",
    data: JSON.stringify(ProjectHistory),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    if (result.status == 200) {
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Data has been updated!",
        showConfirmButtom: false,
        timer: 2000,
      });
      $("#Modal").modal("hide");
      table.ajax.reload();
    } else {
      Swal.fire("Error!", "Data failed to update", "error");
    }
  });
}

//Function delete untuk menghandle hapus project history employee
//Berjalan ketika employee klik button delete pada row table project history
function Delete(projectHistoryId) {
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
        url: "https://localhost:7177/api/ProjectHistory/" + projectHistoryId,
        type: "DELETE",
        dataType: "json",

        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
      }).then((result) => {
        if (result.status == 200) {
          Swal.fire("Deleted!", "Data has been deleted.", "success");
          table.ajax.reload();
        } else {
          Swal.fire("Error!", "Data failed deleted.", "error");
        }
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
