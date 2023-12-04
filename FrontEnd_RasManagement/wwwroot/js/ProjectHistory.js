var table = null;
$(document).ready(function () {
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  table = $("#TB_ProjectHistory").DataTable({
    responsive: true,
    ajax: {
      url:
        "http://202.69.99.67:9001/api/ProjectHistory/accountId?accountId=" +
        accid,
      type: "GET",
      datatype: "json",
      dataSrc: "data",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
      /*success: function (result) {
                console.log(result)
            }*/
    },

    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1 + ".";
        },
      },
      { data: "projectName" },
      /*{ "data": "jobSpec" },*/
      {
        data: "jobSpec",
        render: function (data) {
          // Split data menjadi item-item dalam daftar
          var items = data.split("• ");

          // Buat daftar HTML
          var list = "<ul>";
          for (var i = 1; i < items.length; i++) {
            list += "<li>" + items[i] + "</li>";
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
          return (
            '<button class="btn btn-sm btn-warning p-1 " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' +
            row.projectHistoryId +
            ')"><i class="fa fa-edit"></i></button >' +
            "&nbsp;" +
            '<button class="btn btn-sm btn-danger p-1" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(' +
            row.projectHistoryId +
            ')"><i class="fa fa-trash"></i></button >'
          );
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
      api
        .column(1, { page: "current" })
        .data()
        .each(function (group, i) {
          $(rows)
            .eq(i)
            .find("td:first")
            .html(i + 1);
        });
    },
  });
});

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
  var nohtml = value.replace(/[<>?/]/g, "");
  input.value = nohtml;
}

function handleInput(event, input) {
  // Menangani peristiwa oninput dan onpaste
  noHTML(input);
}

// Proses input pada textarea JobSpesification
$("#JobSpec").on("input", function () {
  var jobSpecValue = $(this).val();

  // Memecah teks menjadi baris-baris
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
      currentValue += "\n• ";
      $(this).val(currentValue);
    }
  }
});

function Save() {
  var isValid = true;

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

  /* var jobSpecValue = $('#JobSpec').val();

    // Pastikan data dimulai dengan bullet ('• ') jika belum
    if (!jobSpecValue.startsWith('• ')) {
        jobSpecValue = '• ' + jobSpecValue;
    }

    // Pisahkan entri dengan bullet ('• ') sebagai pemisah
    var jobSpecEntries = jobSpecValue.split('\n');

    // Hapus elemen yang kosong dari daftar
    jobSpecEntries = jobSpecEntries.filter(function (entry) {
        return entry.trim() !== '';
    });

    // Gabungkan dengan bullet untuk menampilkan data di textarea
    var formattedJobSpec = jobSpecEntries.join('\n• ');

    // Setel nilai textarea dengan data yang diformat
    $('#JobSpec').val(formattedJobSpec);*/

  var ProjectHistory = new Object(); //object baru
  ProjectHistory.projectName = $("#ProjectName").val(); //value insert dari id pada input
  ProjectHistory.jobSpec = $("#JobSpec").val();
  ProjectHistory.year = $("#Year").val();
  ProjectHistory.companyName = $("#CompanyName").val();
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  ProjectHistory.accountId = accid;
  $.ajax({
    type: "POST",
    url: "http://202.69.99.67:9001/api/ProjectHistory",
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

function ClearScreen() {
  $("#ProjectHistoryId").val("");
  $("#ProjectName").val("");
  $("#JobSpec").val("");
  $("#Year").val("");
  $("#CompanyName").val("");
  $("#Update").hide();
  $("#Save").show();
  $("input[required],textarea[required]").each(function () {
    var input = $(this);
    var textarea = $(this);

    input.next(".error-message").hide();
    textarea.next(".error-message").hide();
  });
}

function GetById(projectHistoryId) {
  $.ajax({
    url: "http://202.69.99.67:9001/api/ProjectHistory/" + projectHistoryId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var obj = result.data; //data yg kita dapat dr API
      $("#ProjectHistoryId").val(obj.projectHistoryId);
      $("#ProjectName").val(obj.projectName);
      $("#JobSpec").val(obj.jobSpec);
      $("#Year").val(obj.year);
      $("#CompanyName").val(obj.companyName);
      $("#Modal").modal("show");
      $("#Update").show();
      $("#Save").hide();
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function Update() {
  var isValid = true;

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

  var ProjectHistory = new Object(); //object baru
  ProjectHistory.projectHistoryId = $("#ProjectHistoryId").val();
  ProjectHistory.projectName = $("#ProjectName").val(); //value insert dari id pada input
  ProjectHistory.jobSpec = $("#JobSpec").val();
  ProjectHistory.year = $("#Year").val();
  ProjectHistory.companyName = $("#CompanyName").val();
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  ProjectHistory.accountId = accid;

  $.ajax({
    url: "http://202.69.99.67:9001/api/ProjectHistory",
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
        text: "Data has been update!",
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
        url: "http://202.69.99.67:9001/api/ProjectHistory/" + projectHistoryId,
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
