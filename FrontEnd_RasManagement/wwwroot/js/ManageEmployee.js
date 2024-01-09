$(document).ajaxComplete(function () {
  $('[data-tooltip="tooltip"]').tooltip({
    trigger: "hover",
  });
});

$(document).ready(function () {
  $('input[required], input[required_], input[requiredContract], select[required], select[required_]').each(function () {
    $(this).prev('label').append('<span style="color: red;">*</span>');
});

  $('[data-tooltip="tooltip"]').tooltip({
    trigger: "hover",
  });
  fetchDepartments();

    document.getElementById("Status").addEventListener("change",
        handlePlacementStatusChange);

  // Panggil fungsi saat halaman dimuat untuk mengatur keadaan awal
  window.addEventListener("load", function () {
    // Periksa nilai awal dropdown saat halaman dimuat
    handlePlacementStatusChange();
  });
  $("#dataTableEmployee thead tr")
    .clone(true)
    .addClass("filters")
    .attr("id", "filterRow")
    .appendTo("#dataTableEmployee thead");

  // $('#loader').show();

  var table = $("#dataTableEmployee")
    .on("processing.dt", function (e, settings, processing) {
      $("#loader").css("display", processing ? "block" : "none");
    })
    .DataTable({
      paging: true,
      scrollX: true,
      orderCellsTop: true,
      fixedHeader: true,

      ajax: {
        url: "https://localhost:7177/api/Employees",
        type: "GET",
        datatype: "json",
        async: true,
        dataSrc: "data",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
      },

      initComplete: function () {
        4;
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            // Set the header cell to contain the input element
            var cell = $(".filters th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            // Check if the column is "No", "Gender", or "Placement Status"
            if (title !== "No" && title !== "Action" && title !== "Assets") {
              $(cell).html(
                '<input type="text" class = "form-control form-control-sm pt-0 pb-0" placeholder="' +
                  title +
                  '" />'
              );
              // On every keypress in this input
              $(
                "input",
                $(".filters th").eq($(api.column(colIdx).header()).index())
              )
                .off("keyup change")
                .on("keyup change", function (e) {
                  e.stopPropagation();
                  // Get the search value
                  $(this).attr("title", $(this).val());
                  var regexr = "({search})"; //$(this).parents('th').find('select').val();
                  var cursorPosition = this.selectionStart;
                  // Search the column for that value
                  api
                    .column(colIdx)
                    .search(
                      this.value != ""
                        ? regexr.replace("{search}", "(((" + this.value + ")))")
                        : "",
                      this.value != "",
                      this.value == ""
                    )
                    .draw();
                  $(this)
                    .focus()[0]
                    .setSelectionRange(cursorPosition, cursorPosition);
                });
            } else {
              // For columns "No", "Gender", and "Placement Status", leave the header cell empty
              var cell = $(".filters th").eq(
                $(api.column(colIdx).header()).index()
              );
              $(cell).html("");
            }
            if (title === "Placement Status") {
              // Filter Placement Status column to show only "Idle"
              var placementStatusColumn = api.column(colIdx);
              placementStatusColumn
                .search("^(Idle|Onsite)$", true, false)
                .draw();
            }
          });
      },
      columns: [
        //Render digunakan untuk menampilkan atau memodifikasi isi sel (cell) pada kolom

        {
          // orderable: false, // menonaktifkan order hanya pada kolom tertentu
          data: null,
          width: "4%",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1 + ".";
          },
        },

        { data: "nik" },
        { data: "fullname" },
        { data: "email" },
        { data: "gender" },
        { data: "address" },
        {
          render: function (data, type, row) {
            //var accountId = row.accountId;
            var placementStatus = "Idle"; // Default value jika data tidak ditemukan

            row.placements.forEach(function (placement) {
              if (placement.placementStatus !== "Idle") {
                placementStatus = placement.placementStatus;
              }
            });

            if (placementStatus == "Idle") {
              placementStatus =
                '<button class="badge badge-pill badge-warning" style="outline: none; border:none"  data - placement="right" data - toggle="modal" data - animation="false" title="Edit" onclick="return GetByIdPlacement(\'' +
                row.accountId +
                "', 'Idle')\">Idle</button>";
              //placementStatus = '<span class="badge badge-pill badge-warning">Idle</span>'
            } else {
              placementStatus =
                '<button class="badge badge-pill badge-success" style="outline: none; border:none" data - placement="right" data - toggle="modal" data - animation="false" title="Edit" onclick="return GetByIdPlacement(\'' +
                row.accountId +
                "', '" +
                placementStatus +
                "')\">" +
                placementStatus +
                "</button>";
              //placementStatus = '<span class="badge badge-pill badge-success">' + placementStatus + '</span>'
            }

            return placementStatus;
          },
        },

        {
          render: function (data, type, row) {
            var placementStatus = "Idle";
            row.placements.forEach(function (placement) {
              if (placement.placementStatus !== "Idle") {
                placementStatus = placement.placementStatus;
                placementLocation = placement.companyName;
              }
            });

            if (placementStatus == "Idle") {
              placementLocation = "";
            } else {
              placementLocation = placementLocation;
            }

            return placementLocation;
          },
        },
        { data: "hiredstatus" },
        {
          render: function (data, type, row) {
            var startc = Date.now();
            var endc = new Date(row.endContract);

            var timeDiff = endc.getTime() - startc; // Menghitung selisih dalam milidetik
            var daysremain = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Menghitung selisih dalam hari dan membulatkannya

            /*if (daysremain >= 30) {
                        // Jika sisa kontrak lebih dari 1 bulan, hitung dalam bulan
                        var monthsRemaining = Math.floor(daysremain / 30);
                        return monthsRemaining + " months";
                    } else {
                        // Jika sisa kontrak kurang dari 1 bulan, hitung dalam hari
                        return daysremain + " days";
                    }*/

            var monthsRemaining = Math.floor(daysremain / 30); // Menghitung bulan
            var daysInMonth = daysremain % 30; // Menghitung sisa hari
            //console.log(monthsRemaining);
            //console.log(daysInMonth)
            var result = "";

            /*if (monthsRemaining > 0) {
                        result += monthsRemaining + " months ";
                    }

                    if (daysInMonth > 0) {
                        if (monthsRemaining > 0) {
                            result += daysInMonth + " days";
                        } else {
                            result = '<span class="badge badge-pill badge-danger">' + daysInMonth + ' days' + '</span > '
                        }                     
                    }*/

            if (monthsRemaining > 2) {
              // Jika sisa kontrak lebih dari 3 bulan, beri warna hijau
              result =
                '<span class="badge badge-success" style="font-size: 13px;">' +
                monthsRemaining +
                " bulan " +
                daysInMonth +
                " hari</span>";
            } else if (monthsRemaining >= 1) {
              // Jika sisa kontrak 1-3 bulan, beri warna kuning
              result =
                '<span class="badge badge-warning" style="font-size: 13px;">' +
                monthsRemaining +
                " bulan " +
                daysInMonth +
                " hari</span>";
            } else {
              // Jika sisa kontrak kurang dari 1 bulan, beri warna merah
              if (daysInMonth > 0) {
                result =
                  '<span class="badge badge-danger" style="font-size: 13px;">' +
                  daysInMonth +
                  " hari</span>";
              }
            }

            return result;
          },
        },
        {
          data: null,
          orderable: false,
          render: function (data, type, row) {
            var tulisanButton = "View Asset"; // Default value

            if (row.assetsManagements && row.assetsManagements.length > 0) {
              tulisanButton =
                '<button class="btn btn-success btn-sm rounded-pill" data-placement="left" data-toggle="modal" data-tooltip="tooltip" data-animation="false" title="Assets" onclick="return GetByIdAsset(\'' +
                row.accountId +
                "')\">" +
                "View Data" +
                "</button>";
            } else {
              tulisanButton =
                '<button class="btn btn-secondary btn-sm rounded-pill" data-placement="left" data-toggle="modal" data-tooltip="tooltip" data-animation="false" title="Assets" onclick="return GetByIdAsset(\'' +
                row.accountId +
                "')\">" +
                "Data Empty" +
                "</button>";
            }

            //console.log("Generated HTML:", tulisanButton);
            return tulisanButton;
          },
        },
        {
          data: null,
          orderable: false, // menonaktifkan order
          render: function (data, type, row) {
            return (
              '<div class="text-center row">' +
              '<a href="#" class="text-danger ml-2 pt-0" data-toggle="tooltip" style="font-size: 14pt" data-placement="top" data-tooltip="tooltip" title="Curiculum Vitae" onclick = "GenerateCv(\'' +
              row.accountId +
              '\')"><i class="far fa-file-pdf"></i></a>' +
              '<a href="#" class="ml-2 pt-0 text-primary" data-toggle="tooltip" style="font-size: 14pt" data-placement="top" data-tooltip="tooltip" title="Time Sheet" onclick = "TimeSheetView(\'' +
                row.accountId +
              '\')"><i class="far fa-calendar-check"></i></a>' +  
              '<a href="#" class="btn  ml-2 btn-sm p-0 text-info"  style="font-size: 14pt" data-bs-toggle="modal" data-tooltip="tooltip" title="Detail Employee" onclick = "return Detail(\'' +
              row.accountId +
              '\')"><i class="far fa-edit"></i></a>' +
              "</div>"
            );
          },
        },
      ],
      //"order": [], // menonaktifkan order pada semua kolom
      /*   "fnDrawCallback": function (oSettings) {
                 // mengatur nomor urut berdasarkan halaman dan pengurutan yang aktif, menetapkan nomor urut menjadi 1
                 var table = $('#TB_Department').DataTable();
                 var startIndex = table.context[0]._iDisplayStart;
                 table.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
                     cell.innerHTML = startIndex + i + 1;
                 });
             }*/

      /*   "fndrawCallback": function (settings) {
               var api = this.api();
               var rows = api.rows({ page: 'current' }).nodes();
               api.column(1, { page: 'current' }).data().each(function (group, i) {
   
                   $(rows).eq(i).find('td:first').html(i + 1);
               });s
           }*/
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

  $("#resetFilters").on("click", function () {
    // Reset input pencarian dan filter DataTable
    $("#searchInput").val("");
    table.search("").columns().search("").draw();

    // Hapus elemen baris filter dari DOM
    $(".filters input").val("").keyup().change();

    // Lakukan reload data
    table.ajax.reload();
  });
});

function Detail(id) {
  window.location.href = "/ManageEmployee/DetailEmployee?accountId=" + id;
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
  //var nohtml = value.replace(/[<>?/]/g, '');
  input.value = value;
}

function handleInput(event, input) {
  // Menangani peristiwa oninput dan onpaste
  noHTML(input);
}

/*function GetByIdPlacement(accountId, placementStatus) {
    

    var fullName = ''; // Untuk menyimpan fullname dari kedua pemanggilan API

    // Pemanggilan pertama
    var firstApiCall = $.ajax({
        url: "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            
            var obj = result.data;
            fullName = obj.fullname; // Simpan fullname dari pemanggilan pertama
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });

    // Pemanggilan kedua
    var secondApiCall = $.ajax({
        url: "https://localhost:7177/api/Employees/accountId?accountId=" + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            
            var obj = result.data;
            $('#AccountId').val(accountId);
            $('#PlacementID').val(obj.placementStatusId);
            $('#PlacementStatus').val(placementStatus);
            $('#CompanyName').val(obj.companyName);
            $('#Description').val(obj.description);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });

    // Menunggu kedua pemanggilan API selesai
    $.when(firstApiCall, secondApiCall).done(function () {
        // Setelah keduanya selesai, tampilkan fullname
        $('#FullName').text(fullName);
        console.log(fullName);
        $('#Modal').modal('show');
        $('#Update').show();
    });
}*/

function fetchDepartments() {
  $.ajax({
    url: "https://localhost:7177/api/Department",
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      // Menghapus semua opsi yang ada dalam elemen select
      $("#deptId").empty();

      // Mengisi opsi dengan data departemen dari API
      $.each(result.data, function (index, department) {
        $("#deptId").append(
          $("<option>", {
            value: department.deptId,
            text: department.namaDept,
          })
        );
      });
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function SaveTurnOver() {
  table = $("#dataTableEmployee").DataTable()
  var isValid = true;

  // Validasi select options
  var status = $("#Status").val();

  if (!status) {
    $(".PlacementStatus")
      .closest(".form-group")
      .find(".error-message-status")
      .show();
    isValid = false;
  } else {
    $(".PlacementStatus")
      .closest(".form-group")
      .find(".error-message-status")
      .hide();
  }

  if (!isValid) {
    return;
  }
  var deptIdValue = $("#deptId").val();
  var TurnOver = new Object(); //object baru

  TurnOver.status = $("#Status").val();
  // TurnOver.deptId = $('#DeptId').val();
  TurnOver.deptId = deptIdValue ? deptIdValue : null;

  TurnOver.description = $("#Description").val();
  TurnOver.accountId = $("#AccountId").val();
  TurnOver.exitDate = $("#date").val();

  var updateRole = new Object();
  updateRole.accountId = $("#AccountId").val();
  updateRole.roleId = "4";

  $.ajax({
    type: "POST",

    url: "https://localhost:7177/api/TurnOver",
    data: JSON.stringify(TurnOver),

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
       // debugger;
      //$('#modal-add').modal('hide'); // hanya hide modal tetapi tidak menutup DOM nya
     
      Swal.fire({
        title: "Success!",
        text: "Turn Over Status has Updated",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        if (
          TurnOver.status == "Blacklist" ||
          TurnOver.status == "Resign" ||
          TurnOver.status == "Transfer"
        ) {
          $.ajax({
            url: "https://localhost:7177/api/Accounts/UpdateRole",
            type: "PUT",
            data: JSON.stringify(updateRole),
            contentType: "application/json; charset=utf-8",
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
          }).then((updateResult) => {
              if (updateResult.status === 200) {
                 
              // Handle the success of roleId update if needed
            } else {
              // Handle any errors that occur during roleId update
            }
          });
        }

        table.ajax.reload();
      });
    } else {
      Swal.fire("Error!", "Data failed to turn over", "error");
    }
  });
}

// Fungsi yang dipanggil saat nilai dropdown PlacementStatus berubah
function handlePlacementStatusChange() {
  table = $("#dataTableEmployee").DataTable()
  var selectedOption = document.getElementById("Status").value;
  var inputCompany = document.getElementById("inputCompany");

  // Tampilkan elemen inputCompany jika opsi "Transfer" dipilih, jika tidak, sembunyikan
  if (selectedOption === "Transfer") {
    inputCompany.style.display = "block";
  } else {
    inputCompany.style.display = "none";
  }
}

/*function UpdateContract() {
    var Account = new Object();
    Account.accountId = $('#accountId').val();
    Account.startContract = $('#StartContract').val();
    Account.endContract = $('#EndContract').val();
    $.ajax({
        url: 'https://localhost:7177/api/Accounts/UpdateContract',
        type: 'PUT',
        data: JSON.stringify(Account),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },

    }).then((result) => {
        
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been update!',
                showConfirmButton: false,
                timer: 1500
            })
            $('#Modal').modal('hide');
            table.ajax.reload();
        }
        else {
            Swal.fire(
                'Error!',
                result.message,
                'error'
            )
            table.ajax.reload();
        }
    });
}
*/

function UpdatePlacement() {
  table = $("#dataTableEmployee").DataTable()
  var Placement = new Object();
  Placement.accountId = $("#AccountId").val();
  Placement.placementStatusId = $("#PlacementID").val();
  Placement.placementStatus = $("#PlacementStatus").val();
  Placement.companyName = $("#CompanyName").val();
  Placement.description = $("#Description").val();
  /*const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Account.accountId = accid;*/
  $.ajax({
    url: "https://localhost:7177/api/Accounts/UpdateTurnOver",
    type: "PUT",
    data: JSON.stringify(Placement),
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
      table.ajax.reload();
    } else {
      Swal.fire("Error!", "data failed to be update", "error");
      table.ajax.reload();
    }
  });
}

/*function GetById(accountId) {
    const startDate = document.getElementById("showStartDate");
    const endDate = document.getElementById("showEndDate");
    startDate.style.display = "none";
    endDate.style.display = "block";
    var accountId = accountId;
    $.ajax({
        type: 'GET',
        url: 'https://localhost:7177/api/EmployeePlacements/accountId?accountId=' + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        $('#modal-add').modal('hide');
        $('#modal-add').on('hidden.bs.modal', function () {
            $(this).data('bs.modal', null);
        });
       
        var obj = result.data; //data yg didapat dari api

        // Konversi string tanggal menjadi objek Date
        var startDate = new Date(obj.startDate);
        var endDate = new Date(obj.endDate);

        // Fungsi untuk memformat tanggal menjadi "yyyy-MM-dd" (format yang diharapkan input date)
        function formatDate(date) {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1).toString().padStart(2, '0');
            var day = date.getDate().toString().padStart(2, '0');
            return year + "-" + month + "-" + day;
        }

        $('#companyName').val(obj.companyName);
        $('#jobRole').val(obj.jobRole);
        $('#startDate').val(formatDate(startDate));
        $('#endDate').val(formatDate(endDate));
        $('#description').val(obj.description);
        $('input[name="status"][value="' + obj.placementStatus + '"]').prop('checked', true);
        $('#Update').show();
        $('#Add').hide();



    })
}
*/

function ClearScreenPlacement() {
  const startDate = document.getElementById("showStartDate");
  const endDate = document.getElementById("showEndDate");
  $("#companyName").val("");
  $("#jobRole").val("");
  $("#startDate").val("");
  $("#endDate").val("");
  $("#description").val("");
  $("#placementStatus").val("");
  $("#Update").hide();
  $("#Add").show();
  startDate.style.display = "block";
  endDate.style.display = "none";
  $("input[required]").each(function () {
    var input = $(this);

    input.next(".error-message").hide();
  });
}

/*function Save(accountId) {
  table = $("#dataTableEmployee").DataTable()
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
  var placement = new Object(); //object baru
  placement.companyName = $("#companyName_").val();
  placement.jobRole = $("#jobRole").val();
  placement.startDate = $("#startDate").val();

    placement.description = $("#description").val(); //value insert dari id pada input
    placement.picName = $("#picName").val();

  placement.placementStatus = $('input[name="status"]:checked').val();
  placement.accountId = accountId;

  $.ajax({
    type: "POST",
    url: "https://localhost:7177/api/EmployeePlacements",
    data: JSON.stringify(placement),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    $("#modalPlacement").modal("hide");

    if (
      (result.status == result.status) == 201 ||
      result.status == 204 ||
      result.status == 200
    ) {
      //$('#modal-add').modal('hide'); // hanya hide modal tetapi tidak menutup DOM nya
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Data has been added!",
        showConfirmButtom: false,
        timer: 1500,
      }).then(() => {
        table.ajax.reload();
      });
    } else {
      Swal.fire("Error!", "Data failed to added!", "error");
    }
  });
}*/



function Detail(id) {
  window.location.href = "/ManageEmployee/DetailEmployee?accountId=" + id;
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


function GetByIdPlacement(accountId, placementStatus) {
  $(".PlacementStatus")
    .closest(".form-group")
    .find(".error-message-status")
    .hide();
  $("#date").val("");
  var inputCompany = document.getElementById("inputCompany");
  inputCompany.style.display = "none";
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
      var obj = result.data; //data yg kita dapat dr API
      $.ajax({
        url:
          "https://localhost:7177/api/Employees/accountId?accountId=" +
          accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
          var employee = result.data;

          //document.getElementById('FullName').text = employee.result.fullname;
          $("#Fullname").text(employee.result.fullname);
        },
      });
      $("#AccountId").val(accountId);
        $("#PlacementID").val(obj.placementStatusId);
        $("#picName").val(obj.picName);
      $("#Status").val(placementStatus);
      $("#CompanyName").val(obj.companyName);
      $("#Description").val(obj.description);
      $("#Modal").modal("show");
      $("#Update").show();
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function SaveTurnOver() {
  table = $("#dataTableEmployee").DataTable()
  var isValid = true;

  // Validasi select options
  var status = $("#Status").val();

  if (!status) {
    $(".PlacementStatus")
      .closest(".form-group")
      .find(".error-message-status")
      .show();
    isValid = false;
  } else {
    $(".PlacementStatus")
      .closest(".form-group")
      .find(".error-message-status")
      .hide();
  }

  $("input[required_]").each(function () {
    var input = $(this);
    if (!input.val()) {
      input.next(".error-message-turnOver").show();
      isValid = false;
    } else {
      input.next(".error-message-turnOver").hide();
    }
  });

  if (!isValid) {
    return;
  }
  var deptIdValue = $("#deptId").val();
  var TurnOver = new Object(); //object baru

  TurnOver.status = $("#Status").val();
  // TurnOver.deptId = $('#DeptId').val();
  TurnOver.deptId = deptIdValue ? deptIdValue : null;
  TurnOver.description = $("#Description").val();
  TurnOver.description = $("#Description").val();
  TurnOver.accountId = $("#AccountId").val();
  TurnOver.exitDate = $("#date").val();

  var updateRole = new Object();
  updateRole.accountId = $("#AccountId").val();
  updateRole.roleId = "4";

  $.ajax({
    type: "POST",
    url: "https://localhost:7177/api/TurnOver",
    data: JSON.stringify(TurnOver),
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
        const activity = `Has Change Status Employee Id ${updateRole.accountId} To ${TurnOver.status} (Turn Over Employee)`;
        SaveLogUpdate(activity);
      //$('#modal-add').modal('hide'); // hanya hide modal tetapi tidak menutup DOM nya
      Swal.fire({
        title: "Success!",
        text: "Turn Over Status has Updated",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        if (
          TurnOver.status == "Blacklist" ||
          TurnOver.status == "Resign" ||
          TurnOver.status == "Transfer"
        ) {
          $.ajax({
            url: "https://localhost:7177/api/Accounts/UpdateRole",
            type: "PUT",
            data: JSON.stringify(updateRole),
            contentType: "application/json; charset=utf-8",
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
          }).then((updateResult) => {
            if (updateResult.status === 200) {
              // Handle the success of roleId update if needed
            } else {
              // Handle any errors that occur during roleId update
            }
          });
        }

        table.ajax.reload();
      });
    } else {
      Swal.fire("Error!", "Turn Over status failed to update", "error");
    }
  });
}

// Fungsi yang dipanggil saat nilai dropdown PlacementStatus berubah
function handlePlacementStatusChange() {
  table = $("#dataTableEmployee").DataTable()
  var selectedOption = document.getElementById("Status").value;
  var inputCompany = document.getElementById("inputCompany");

  // Tampilkan elemen inputCompany jika opsi "Transfer" dipilih, jika tidak, sembunyikan
  if (selectedOption === "Transfer") {
    inputCompany.style.display = "block";
  } else {
    inputCompany.style.display = "none";
  }
}

function GetContract(accountId) {
  $.ajax({
    url: "https://localhost:7177/api/Accounts/AccountId?accountId=" + accountId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var obj = result.data;
      $("#AccountId").val(obj.accountId); //ngambil data dr api
      $("#StartContract").val(obj.startContract);
      $("#EndContract").val(obj.endContract);
      $("#modalContract").modal("show");
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function UpdateContract() {
  table = $("#dataTableEmployee").DataTable()
  var isValid = true;
  $("input[requiredContract]").each(function () {
    var input = $(this);
    if (!input.val()) {
      input.next(".error-message-contract").show();
      isValid = false;
    } else {
      input.next(".error-message-contract").hide();
    }
  });

  if (!isValid) {
    return;
  }
  var Account = new Object();
  Account.accountId = $("#accountId").val();
  Account.startContract = $("#StartContract").val();
  Account.endContract = $("#EndContract").val();

  $.ajax({
    url: "https://localhost:7177/api/Accounts/UpdateContract",
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
        const logMessage = `Has updated contract Account ID ${Account.accountId}, starting from ${Account.startContract} to ${Account.endContract}`;
        SaveLogUpdate(logMessage);
      $("#modalContract").modal("hide");
      setTimeout(function () {
        table.ajax.reload();
      }, 1800); // 3000 milliseconds = 3 seconds
    } else {
      Swal.fire("Error!", "Data failed to update", "error");
      table.ajax.reload();
    }
  });
}

function UpdatePlacement() {
  table = $("#dataTableEmployee").DataTable()
  var Placement = new Object();
  Placement.accountId = $("#AccountId").val();
  Placement.placementStatusId = $("#PlacementID").val();
  Placement.placementStatus = $("#PlacementStatus").val();
  Placement.companyName = $("#CompanyName").val();
  Placement.description = $("#Description").val();
  /*const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Account.accountId = accid;*/
  $.ajax({
    url: "https://localhost:7177/api/Accounts/UpdateTurnOver",
    type: "PUT",
    data: JSON.stringify(Placement),
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
      table.ajax.reload();
    } else {
      Swal.fire("Error!", "Data failed to update", "error");
      table.ajax.reload();
    }
  });
}


function ClearScreenContract() {
  $("#AccountId").val("");
  $("#StartContract").val("");
  $("#EndContract").val("");

  $("input[required]").each(function () {
    var input = $(this);

    input.next(".error-message").hide();
  });

  // Menyembunyikan pesan kesalahan untuk kedua input
  $(".error-message").hide();

  /*$('#accountId').val('');
    $('#StartContract').val('');
    $('#EndContract').val('');
    $('input[required]').each(function () {
        var input = $(this);

        input.next('.error-message-contract').hide();

    });*/
}

function ClearScreenPlacement() {
  const startDate = document.getElementById("showStartDate");
  const endDate = document.getElementById("showEndDate");
  $("#companyName_").val("");
  $("#jobRole").val("");
  $("#startDate").val("");
  $("#endDate").val("");
  $("#description").val("");
  $("#placementStatus").val("");
  $("#Update").hide();
  $("#Add").show();
  startDate.style.display = "block";
  endDate.style.display = "none";
  $("input[required]").each(function () {
    var input = $(this);

    input.next(".error-message").hide();
  });

  $('input[name="status"]').prop("checked", false);
}

function ClearScreenChangeStatus() {
  $("#AccountId").val("");
  $("#Status").val("");
  $("#date").val("");
  $("#Description").val("");

  $(".error-message, .error-message-turnOver").hide();
}

function Save(accountId) {
  table = $("#dataTableEmployee").DataTable()
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
    
  var placement = new Object(); //object baru
  placement.companyName = $("#companyName_").val();
  placement.jobRole = $("#jobRole").val();
  placement.startDate = $("#startDate").val();
    placement.picName = $("#picName").val();
  placement.description = $("#description").val(); //value insert dari id pada input

  placement.placementStatus = $('input[name="status"]:checked').val();
  placement.accountId = accountId;

  $.ajax({
    type: "POST",
    url: "https://localhost:7177/api/EmployeePlacements",
    data: JSON.stringify(placement),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    $("#modalPlacement").modal("hide");

    if (
      (result.status == result.status) == 201 ||
      result.status == 204 ||
      result.status == 200
    ) {
      //$('#modal-add').modal('hide'); // hanya hide modal tetapi tidak menutup DOM nya
        const logMessage = `Has added placement to account ID ${placement.accountId}, status ${placement.placementStatus}`;
        SaveLogUpdate(logMessage);
      Swal.fire({
        title: "Success!",
        text: "Data has been added!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        location.ajax.reload();
      });
    } else {
      Swal.fire("Error!", "Data failed to added", "error");
    }
  });
}

function Update() {

  var placement = new Object();
  placement.placementStatusId = $("#placementStatusId").val();
  placement.companyName = $("#companyName_").val();
  placement.jobRole = $("#jobRole").val();
    placement.startDate = $("#startDate").val();
    placement.picName = $("#picName").val();

  placement.endDate = $("#endDate").val();
  if (placement.endDate == "") {
    placement.endDate = null;
  }
  placement.description = $("#description").val(); //value insert dari id pada input
  placement.placementStatus = $('input[name="status"]:checked').val();
  placement.accountId = $("#accountId").val();

  $.ajax({
    url: "https://localhost:7177/api/EmployeePlacements",
    type: "PUT",
    data: JSON.stringify(placement),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    $("#modalPlacement").modal("hide");
      if (result.status == 200) {
          const logMessage = `Has Changed Placement of Account ID ${placement.accountId}, Placement Status Id ${placement.placementStatusId}, Status ${placement.placementStatus}`;
          SaveLogUpdate(logMessage);
      Swal.fire({
        title: "Success!",
        text: "Data has been Update!",
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

function GenerateCv(accountId) {
  window.location.href = "/GenerateCv/Index?accountId=" + accountId;
}

function TimeSheetView(accountId) {
    window.location.href = "/TimeSheets/Index?accountId=" + accountId;
}

function GetByIdAsset(assetsManagementId) {
  $.ajax({
    url:
      "https://localhost:7177/api/Assets/accountId?accountId=" +
      assetsManagementId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      if (result.data.length > 0) {
        var obj = result.data[0]; //data yang diperoleh dari id
        $("#brand").text(obj.nama);
        $("#RFID").text(obj.rfid);
        $("#Processor").text(obj.processor);
        $("#Display").text(obj.display);
        $("#os").text(obj.operatingSystem);
        $("#ram").text(obj.ram);
        $("#ssd").text(obj.ssd);
        $("#hdd").text(obj.hdd);
        $("#GraphicCard").text(obj.graphicCard);
        var chargerElement = $("#charger");
        chargerElement.text(obj.charger ? "Yes" : "No");
        $("#ModalAssets").modal("show");
      } else {
        // Tampilkan modal lain jika data kosong
        $("#EmptyDataModal").modal("show");
      }
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}
