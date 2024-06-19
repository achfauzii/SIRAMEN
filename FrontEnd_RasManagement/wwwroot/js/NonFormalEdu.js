//NonFormalEdu.js digunakan untuk menghandle View, Add, Edit dan delete NonFormal Edu yang ada pada bagian admin
//Non Formal edu berada pada file Employee->Educations menjadi satu dengan Education hanya berbeda table

var initialNonFormalEdu = {};
$(document).ready(function () {
  //ParseJWT untuk mendapatkan account id dari token
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;

//Menampilkan table Nonformal Edu berdsarkan Account Id Employee
  $("#NonFormalEdu").DataTable({
    responsive: true,
    ajax: {
      url:
        "https://localhost:7177/api/NonFormalEdu/accountId?accountId=" + accid,
      type: "GET",
      datatype: "json",
      dataSrc: "data",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
    },
      pageLength: 3,
      pagingType: "full_numbers",
    lengthMenu: [3, 10, 25, 50],
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      { data: "name" },
      { data: "organizer" },
      { data: "years" },
      { data: "description" },
      {
        data: null,
        render: function (data, type, row) {
          return (
            '<button class="btn btn-sm btn-warning " data-placement="left" data-toggle="tooltip" data-animation="false" title="Edit" onclick="return getbyID(' +
            row.nonFormalId +
            ')"><i class="fa fa-pen" ></i></button >' +
            "&nbsp;" +
            '<button class="btn btn-sm btn-danger" data-placement="right" data-toggle="tooltip" data-animation="false" title="Delete" onclick="return Delete(' +
            row.nonFormalId +
            ')"><i class="fa fa-trash"></i></button >'
          );
        },
      },
    ],
    order: [[3, "desc"]],
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

function parseJwt(token) {
  //debugger;
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

//Clear Form Non Formal Edu
function ClearScreen() {
  //debugger;
  $("#UpdateNonFormal").hide();
  $("#SaveNonFormal").show();
  
    $('#ModalNonFormal').find('input, select,textarea').each(function (e) {
        $(this).val('');
        $(this).val("").trigger("change");
    })
    $(".error-message").hide();
}


//Function berikut untuk mengisi value pada form edit non formal education
//Menerima parameter NonFormalId untuk get data by NonFormalId
function getbyID(NonFormalId) {
    ClearScreen()
    $("#UpdateNonFormal").show();
    $("#SaveNonFormal").hide();
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  $.ajax({
    url: "https://localhost:7177/api/NonFormalEdu/" + NonFormalId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var obj = result.data; //data yg dapet dr id
      $("#NonformalId").val(obj.nonFormalId); //ngambil data dr api
      $("#Name").val(obj.name);
      $("#Organizer").val(obj.organizer);
      $("#Years").val(obj.years);
      $("#Description").val(obj.description);
      $("#AccountId").accid;
      $("#ModalNonFormal").modal("show");
      $("#SaveNonFormal").hide();
      $("#UpdateNonFormal").show();

      initialNonFormalEdu = {
        Name: obj.name,
        Organizer: obj.organizer,
        Years: obj.years,
        Description: obj.description,
      };
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
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


//Function save ini adalah untuk menyimpan data ke server
//Berjalan ketika employee klik tombol save pada form Add NonFroaml Education
function Save() {
  var isValid = true;

  $("input[required-nonformal],select[required-nonformal]").each(function () {
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
  var NonFormal = new Object(); //bikin objek baru
  NonFormal.Name = $("#Name").val(); //value dari database
  NonFormal.Organizer = $("#Organizer").val();
  NonFormal.Years = $("#Years").val();
  NonFormal.Description = $("#Description").val();
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  NonFormal.AccountId = accid;
  $.ajax({
    type: "POST",
    url: "https://localhost:7177/api/NonFormalEdu",
    data: JSON.stringify(NonFormal), //ngirim data ke api
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    if (
      (result.status == result.status) == 201 ||
      result.status == 204 ||
      result.status == 200
    ) {
      //alert("Data Berhasil Dimasukkan");
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Data has been added!",
        showConfirmButton: false,
        timer: 1500,
      });
      $("#ModalNonFormal").modal("hide");
      $("#NonFormalEdu").DataTable().ajax.reload();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Data failed to added!",
        showConfirmButtom: false,
        timer: 1500,
      });
      $("#ModalNonFormal").modal("hide");
      $("#NonFormalEdu").DataTable().ajax.reload();
    }
  });
}

//Function Delete Non Formal Education
function Delete(NonFormalId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.value) {
      $.ajax({
        url: "https://localhost:7177/api/NonFormalEdu/" + NonFormalId,
        type: "DELETE",
        dataType: "json",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
      }).then((result) => {
        if (result.status == 200) {
          Swal.fire("Deleted!", "Data has been deleted!", "success");
          $("#NonFormalEdu").DataTable().ajax.reload();
        } else {
          Swal.fire("Error!", "Data failed to deleted!", "error");
        }
      });
    }
  });
}

//Function Update Non Formal Education
function Update() {
  var isValid = true;

  $("input[required-nonformal],select[required-nonformal]").each(function () {
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
  var NonFormal = new Object();
  NonFormal.NonFormalId = $("#NonformalId").val();
  NonFormal.Name = $("#Name").val();
  NonFormal.Organizer = $("#Organizer").val();
  NonFormal.Years = $("#Years").val();
  NonFormal.Description = $("#Description").val();
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  NonFormal.AccountId = accid;

  if (
    NonFormal.Name == initialNonFormalEdu.Name &&
    NonFormal.Organizer == initialNonFormalEdu.Organizer &&
    NonFormal.Years == initialNonFormalEdu.Years &&
    NonFormal.Description == initialNonFormalEdu.Description
  ) {
    Swal.fire({
      icon: "info",
      title: "No Changes Detected",
      text: "No data has been modified.",
      showConfirmButton: false,
      timer: 2000,
    });
    $("#ModalNonFormal").modal("hide");
    return;
  }
  $.ajax({
    url: "https://localhost:7177/api/NonFormalEdu",
    type: "PUT",
    data: JSON.stringify(NonFormal),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    if (result.status == 200) {
      Swal.fire({
        title: "Success!",
        text: "Data has been update!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        location.reload();
      });
    } else {
      Swal.fire("Error!", "Data failed to update", "error");
      location.reload();
    }
  });
}
