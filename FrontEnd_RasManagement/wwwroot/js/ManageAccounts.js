$(document).ready(function () {
  /*const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
      const accid = decodedtoken.AccountId;*/
  $("#dataTableAccounts").DataTable({
    responsive: true,
    ajax: {
      url: "https://localhost:7177/api/Employees/EmployeeAdmin",
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
      { data: "fullname" },
      { data: "email" },
      { data: "gender" },
      { data: "hiredstatus" },
      {
        data: "nik",
        render: function (data, type, row) {
          if (data == null || data == "") {
            data =
              '<button class="badge badge-secondary" data - placement="right" style="outline: none; border: none;" onclick="return GetByIdNIK(\'' +
              row.accountId +
              "')\">Edit NIK</button>";
          } else {
            data =
              '<button class="badge badge-light" data - placement="right" style="outline: none; border: none;" onclick="return GetByIdNIK(\'' +
              row.accountId +
              "')\">" +
              data +
              "</button>";
          }

          return data;
        },
      },
      {
        data: null,
        render: function (data, type, row) {
          var roleId = row.roleId;

          if (roleId == "3") {
            role =
              '<button class="badge badge-pill badge-primary" data - placement="right" data - toggle="modal" data - animation="false" style="outline: none; border: none;" title="Edit" onclick="return GetById(\'' +
              row.accountId +
              "')\">Employee</button>";
          } else {
            role =
              '<button class="badge badge-pill badge-warning" data - placement="right" style="outline: none; border: none;" onclick="DeleteAdmin(\'' +
              row.accountId +
              "')\">Admin</button>";
          }
          return role;
        },
      },
    ],
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

function ClearScreen() {
  $("#ModalNIK").val("");

  $("input[required]").each(function () {
    var input = $(this);

    input.next(".error-message").hide();
  });
}

function GetById(accountId) {
  /*const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
      const accid = decodedtoken.AccountId;*/
  $.ajax({
    url: "https://localhost:7177/api/Accounts/AccountId?accountId=" + accountId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var obj = result.data; //data yg kita dapat dr API
      $("#AccountId").val(obj.accountId);
      $("#Role").val(obj.roleId);

      $("#FullName").text(obj.fullname);
      $("#Modal").modal("show");
      $("#Update").show();
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function GetByIdNIK(accountId) {
  /*const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
      const accid = decodedtoken.AccountId;*/
  $.ajax({
    url: "https://localhost:7177/api/Accounts/AccountId?accountId=" + accountId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var obj = result.data; //data yg kita dapat dr API
      $("#AccountIdNIK").val(obj.accountId);
      $("#NIK").val(obj.nik);

      $("#FullName_").text(obj.fullname);
      $("#ModalNIK").modal("show");
      $("#UpdateNIK").show();
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function UpdateRole() {
  var Account = new Object();
  Account.accountId = $("#AccountId").val();
  Account.roleId = $("#Role").val();

  $.ajax({
    url: "https://localhost:7177/api/Accounts/UpdateRole",
    type: "PUT",
    data: JSON.stringify(Account),
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
        showConfirmButton: false,
        timer: 1500,
      });
      $("#Modal").modal("hide");
      $("#dataTableAccounts").DataTable().ajax.reload();
    } else {
      Swal.fire("Error!", result.message, "error");
      $("#dataTableAccounts").DataTable().ajax.reload();
    }
  });
}

function UpdateNIK() {
  var isValid = true;

  $("input[required]").each(function () {
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

  var Account = new Object();
  Account.accountId = $("#AccountIdNIK").val();
  Account.nik = $("#NIK").val();

  $.ajax({
    url: "https://localhost:7177/api/Accounts/UpdateNIK",
    type: "PUT",
    data: JSON.stringify(Account),
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
        showConfirmButton: false,
        timer: 1500,
      });
      $("#ModalNIK").modal("hide");
      $("#dataTableAccounts").DataTable().ajax.reload();
    } else {
      Swal.fire("Error!", result.message, "error");
      $("#dataTableAccounts").DataTable().ajax.reload();
    }
  });
}

function DeleteAdmin(accountId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "DELETE",
        url: "https://localhost:7177/api/Accounts/Delete/" + accountId,
        contentType: "application/json",
        dataType: "json",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
      }).then((result) => {
        Swal.fire({
          icon: "success",
          title: "Success...",
          text: "Data has been deleted!",
          showConfirmButton: false,
          timer: 1500,
        });
        $("#dataTableAccounts").DataTable().ajax.reload();
      });
    }
  });
}
