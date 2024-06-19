//ManageEmployee.js ini digunakan dalam menghandle halaman Manage Resource dan View Detail Employee pada bagian admin
//File Cshtml Manage Employee -> index dan detail emplooye 
//Sebagian besar code digunakan untuk menampilkan data employee, Turn Over Employee, dan menghandel datatable
//Menghandle placement status idle atau onsite untuk ditampilkan di table dan menghandul action button GeneratePDF,TimeSheet, Detail Employee
// dan menghandle button Filter Data
var table = null;
var colorsByWord = {};
var colorByPosition = {};
var compareLevel = {};

//Variabel color digunakan untuk pengacakan color positions
var softlColors = [
    "#B7E4C7", // Mint Green
    "#FFD8B1", // Soft Peach
    "#C9C8E8", // Lavender Grey
    "#BCCEF8",
    "#AED9E0", // Sky Blue
    "#F9E4AD", // Pale Yellow
    "#FFA69E", // Coral Pink
    "#D0AEEF", // Pastel Lilac
    "#B5DFE6", // Icy Blue
    "#F6E4C8", // Buttercreamy
    "#c9a7eb",
    "#a4b0f5",
    "#D2E0FB",
    "#F7F5EB",
];

var pastelColors = [
    "#B7E4C7", // Mint Green
    "#FFD8B1", // Soft Peach
    "#C9C8E8", // Lavender Grey
    "#BCCEF8",
    "#AED9E0", // Sky Blue
    "#F9E4AD", // Pale Yellow
    "#FFA69E", // Coral Pink
    "#D0AEEF", // Pastel Lilac
    "#B5DFE6", // Icy Blue
    "#F6E4C8", // Buttercream
    "#c9a7eb",
    "#a4b0f5",
    "#D2E0FB",
    "#F7F5EB",
];


$(document).ajaxComplete(function () {
    $('[data-tooltip="tooltip"]').tooltip({
        trigger: "hover",
    });
});


$(document).ready(function () {
    getPlacementLoc();
    getPosition();

    //Mendapatkan placementStatus
    var urlParams = new URLSearchParams(window.location.search);
    var placementStatus_ = urlParams.get("placementStatus");

    if (placementStatus_ != null || placementStatus_ != "") {
        if (placementStatus_ === "Onsite") {
            $("#option9").prop("checked", true);
            handleFilterSubmission()
        } else if (placementStatus_ === "Idle") {
            $("#option10").prop("checked", true);
            handleFilterSubmission()
        }
    }

    var objDataToken = parseJwt(sessionStorage.getItem("Token"));

    if (objDataToken.RoleId == 7) {
        $(".edit-contract-emp").hide();
    }

    $(
        "input[required], input[required_], input[requiredContract], select[required], select[required_]"
    ).each(function () {
        $(this).prev("label").append('<span style="color: red;">*</span>');
    });


    $('[data-tooltip="tooltip"]').tooltip({
        trigger: "hover",
    });
    fetchDepartments();

    // document
    //   .getElementById("Status")
    //   .addEventListener("change", handlePlacementStatusChange);
    $("#Status").on("change", function () {
        handlePlacementStatusChange();
    });

    // Panggil fungsi saat halaman dimuat untuk mengatur keadaan awal
    window.addEventListener("load", function () {
        // Periksa nilai awal dropdown saat halaman dimuat
        handlePlacementStatusChange();
    });





    $("#submitFilter").on("click", function () {
        handleFilterSubmission();
    });

    $("#resetFilterData").on("click", function () {
        resetFilter();
    });

  

    var urlParams = new URLSearchParams(window.location.search);
    var placementStatus_ = urlParams.get("placementStatus");
    //console.log(placementStatus_);
    if (placementStatus_ !== null) {
        if (placementStatus_ === "Onsite") {
            $("#option9").prop("checked", true);
            handleFilterSubmission()
        } else if (placementStatus_ === "Idle") {
            $("#option10").prop("checked", true);
            handleFilterSubmission()
        }
    } else {
        //Menampilkan View Table Employee
        table = $("#dataTableEmployee")
            .on("processing.dt", function (e, settings, processing) {
                $("#loader").css("display", processing ? "block" : "none");
            })
            .DataTable({
                fixedColumns: {
                    leftColumns: window.innerWidth > 1024 ? 3 : null,
                },
                paging: true,

                pagingType: "full_numbers",
                fixedHeader: true,
                scrollX: true,
                scrollY: true,
                // scrollCollapse: true,
                orderCellsTop: true,
                /*search: { search: placementStatus_ !== null ? placementStatus_ : '' },*/

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

             
                columns: [
                    //Render digunakan untuk menampilkan atau memodifikasi isi sel (cell) pada kolom

                    {
                        data: null,
                        width: "4%",
                        render: function (data, type, row, meta) {
                            return meta.row + meta.settings._iDisplayStart + 1 + ".";
                        },
                    },

                    { data: "nik" },
                    {
                        data: "fullname",
                        render: function (data, type, row) {
                            if (type === "display" || type === "filter") {
                                // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
                                var icon =
                                    '<div class="row"><div class="col-4 text-left mr-5">' +
                                    data +
                                    '</div><div class="col text-right"><i class="fas fa-external-link-alt edit btn-edit-status" style="color: #ff0000;  visibility: hidden;" onclick="return GetByIdPlacement(\'' +
                                    row.accountId +
                                    "')\"></i>";

                                // Validasi manager hide action (Only View)
                                var objDataToken = parseJwt(sessionStorage.getItem("Token"));
                                if (objDataToken.RoleId == 7) {
                                    $(".btn-edit-status, .edit").hide();
                                }

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
                    {
                        data: "position",
                        render: function (data) {
                            if (data == null) {
                                var a = "";
                                return a;
                            }

                            var posisitionSplit = data.split(",");

                            var badgeContainer = $('<div class="badge-container"></div>');

                            for (var i = 0; i < posisitionSplit.length; i++) {
                                var word = posisitionSplit[i].trim();
                                var badgeColor = getColorForPosition(word);
                                var badge = $(
                                    '<span class="badge rounded-pill badge-pastel text-dark">' +
                                    word +
                                    "</span>"
                                );

                                // Atur warna latar belakang badge sesuai dengan kata yang sama
                                badge.css("background-color", badgeColor);

                                badgeContainer.append(badge);
                                if (i < posisitionSplit.length - 1) {
                                    badgeContainer.append(" ");
                                }
                            }
                            // Kembalikan HTML dari container badge
                            return badgeContainer.html();
                        },
                    },
                    {
                        data: "level",
                        render: function (data, type, row) {
                            var levelStatus = row.level;

                            // Validasi manager hide action (Only View)
                            var objDataToken = parseJwt(sessionStorage.getItem("Token"));
                            if (objDataToken.RoleId == 7) {
                                return data;
                            }

                            if (levelStatus === "Fresh Graduate") {
                                return (
                                    '<span type="button" class="badge rounded-pill badge-dark" data-bs-toggle="modal" data-bs-target="#modalLevel" onclick="GetbyLevel(\'' +
                                    row.accountId +
                                    "')\">" +
                                    row.level +
                                    "</span>"
                                );
                            } else if (
                                levelStatus === "Junior" ||
                                levelStatus === "Junior to Middle" ||
                                levelStatus === "Middle to Senior"
                            ) {
                                return (
                                    '<span type="button" class="badge rounded-pill badge-danger" data-bs-toggle="modal" data-bs-target="#modalLevel" onclick = "GetbyLevel(\'' +
                                    row.accountId +
                                    "')\">" +
                                    row.level +
                                    "</span>"
                                );
                            } else {
                                return (
                                    '<span type="button" class="badge rounded-pill badge-primary" data-bs-toggle="modal" data-bs-target="#modalLevel" onclick="GetbyLevel(\'' +
                                    row.accountId +
                                    "')\">" +
                                    row.level +
                                    "</span>"
                                );
                            }
                        },
                    },
                    { data: "email" },
                    { data: "gender" },
                    { data: "address" },
                    {
                        data: "financialIndustry",
                        render: function (data, type, row) {
                            if (type === "display") {
                                // Jika data bernilai true, tambahkan atribut checked
                                var isChecked =
                                    data === "true" || data === "True" ? "checked" : "";

                                return (
                                    '<input type="checkbox" class="financialIndustry" id="financialIndustryCheck" ' +
                                    isChecked +
                                    ">"
                                );
                            }
                            return data;
                        },
                        className: "text-center",
                    },
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
                                /*placementStatus =
                                                                '<span class="badge rounded-pill badge-warning" style="outline: none; border:none"  data - placement="right" data - toggle="modal" data - animation="false" title="Edit" onclick="return GetByIdPlacement(\'' +
                                                                row.accountId +
                                                                "', 'Idle')\">Idle</button>";*/
                                placementStatus =
                                    '<span class="badge rounded-pill badge-warning" style="outline: none; border:none">Idle</span>';
                            } else {
                                /*placementStatus =
                                                                '<button class="badge rounded-pill badge-success" style="outline: none; border:none" data - placement="right" data - toggle="modal" data - animation="false" title="Edit">' +placementStatus +'</button>';*/
                                placementStatus =
                                    '<span class="badge rounded-pill badge-success" style="outline: none; border:none">' +
                                    placementStatus +
                                    "</span>";
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
                                    placementLocation = placement.clientId;
                                }
                            });

                            if (placementStatus == "Idle") {
                                placementLocation = "";
                            } else {
                                $.ajax({
                                    url:
                                        "https://localhost:7177/api/ClientName/" + placementLocation, // URL API yang diinginkan
                                    type: "GET",
                                    async: false, // Tunggu hingga permintaan selesai (opsional, bisa diubah)
                                    headers: {
                                        Authorization: "Bearer " + sessionStorage.getItem("Token"),
                                    },
                                    success: function (response) {
                                        placementLocation = response.data.nameOfClient;
                                    },
                                    error: function (xhr, status, error) {
                                        console.error(xhr.responseText);
                                    },
                                });
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
                        width: "7%",
                        render: function (data, type, row) {
                            return (
                                '<div class="d-flex flex-row">' +
                                '<a href="#" class="text-danger ml-2 pt-0" data-toggle="tooltip" style="font-size: 14pt" data-placement="left" data-tooltip="tooltip" title="Curiculum Vitae" onclick = "GenerateCv(\'' +
                                row.accountId +
                                '\')"><i class="far fa-file-pdf"></i></a>' +
                                '<a href="#" class="ml-1 pt-0 text-primary" data-toggle="tooltip" style="font-size: 14pt" data-placement="left" data-tooltip="tooltip" title="Time Sheet" onclick = "TimeSheetView(\'' +
                                row.accountId +
                                '\')"><i class="far fa-calendar-check"></i></a>' +
                                '<a href="#" class="btn  ml-1 btn-sm p-0 text-info"  style="font-size: 14pt" data-bs-toggle="modal" data-placement="left" data-tooltip="tooltip" title="Detail Employee" onclick = "return Detail(\'' +
                                row.accountId +
                                '\')"><i class="far fa-edit"></i></a>' +
                                "</div>"
                            );
                        },
                        //visible: objDataToken.RoleId != 7,
                    },
                ],
                order: [2, 'asc'],
                columnDefs: [
                    {
                        defaultContent: "-",
                        targets: "_all",
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

                    api
                        .column(0, { page: "current" })
                        .nodes()
                        .each(function (cell, i) {
                            cell.innerHTML = startNumber + i; // Mengupdate nomor baris pada setiap halaman
                        });
                },
            });
    }
    //Check Box Financial Industry

    $("#dataTableEmployee").on(
        "change",
        "#financialIndustryCheck",
        function (data) {
            var row = $(this).closest("tr");
            var rowIndex = table.row(row).index();
            var isChecked = $(this).prop("checked");

            var rowData = table.row(rowIndex).data();
            var financialIndustryValue = { financialIndustry: isChecked.toString() };
            if (isChecked == true) {
                var status = "Yes";
            } else {
                var status = "No";
            }

            Swal.fire({
                title: "Do you want to change?",
                text: `You changes ${rowData.fullname}'s financial industry to ${status}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: "https://localhost:7177/api/Employees/" + rowData.accountId,
                        type: "PUT",
                        data: JSON.stringify(financialIndustryValue),
                        contentType: "application/json; charset=utf-8",
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("Token"),
                        },
                        success: function (result) {
                            if ((result.status = 200)) {
                                Swal.fire({
                                    title: "Data has been change!",
                                    icon: "success",
                                });
                                const logMessage = `Has change financial Industry ${rowData.accountId
                                    }, to FinancialIndustry : ${isChecked.toString()}`;
                                SaveLogUpdate(logMessage);
                            }
                        },
                    });
                } else {
                    // Jika pengguna memilih "No", Anda dapat melakukan sesuatu di sini

                    // Contoh: Mengubah kembali status checkbox sesuai dengan nilai sebelumnya
                    $(this).prop("checked", !isChecked);
                }
            });
        }
    );

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

//Melakukan parse JWT token untuk mendapatkan data yang ada pada token
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
    input.value = value;
}

function handleInput(event, input) {
    // Menangani peristiwa oninput dan onpaste
    noHTML(input);
}

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
            $("#deptId").prepend(
                $("<option>", {
                    value: "",
                    text: "Select Department",
                    selected: true,
                    disabled: true
                })
            );
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}


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

//Function berikut diguanakan dalam menangani Edit Placement yang akan mengisi value form eidt tersebut
//Form Edit Placement berada pada detail employee
//Dijalankan ketika admin klik tombol edit
function GetByIdPlacement(accountId, placementStatus) {

    //ClearScreenPlacement();
    ClearScreenChangeStatus();


    //debugger;
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
            $("#picNameRas").val(obj.picRas);

            $("#CompanyName").val(obj.clientId);
            $("#Description").val(obj.description);
            $("#Modal").modal("show");
            $("#Update").show();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

//Function berikut digunakan untuk menyimpan turnover yang dilakukan oleh admin
//Untuk menjalankan function ini dnegan klik button update pada form turnover
function SaveTurnOver() {
    table = $("#dataTableEmployee").DataTable();
    var isValid = true;

    // Validasi select options
    var status = $("#Status").val();
    var deptId = $("#deptId").val();
    if (status == "Transfer") {
        if (deptId == null || deptId == "") {
            $(".selectDept")
                .closest(".form-group")
                .find(".error-message-dept")
                .show();
            isValid = false;
        }

    }
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

    TurnOver.accountId = $("#AccountId").val();
    TurnOver.exitDate = $("#date").val();

    var updateRole = new Object();
    updateRole.accountId = $("#AccountId").val();
    updateRole.roleId = "4";
    $("#Modal").modal("hide");
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
                $("#Modal").modal("hide");
                location.reload();
            });
        } else {
            Swal.fire("Error!", "Turn Over status failed to update", "error");
        }
    });
}

// Fungsi yang dipanggil saat nilai dropdown PlacementStatus berubah
function handlePlacementStatusChange() {
    table = $("#dataTableEmployee").DataTable();
    var selectedOption = document.getElementById("Status").value;
    var inputCompany = document.getElementById("inputCompany");

    // Tampilkan elemen inputCompany jika opsi "Transfer" dipilih, jika tidak, sembunyikan
    if (selectedOption === "Transfer") {
        $("#deptId").val("");
        inputCompany.style.display = "block";
    } else {
        inputCompany.style.display = "none";
    }
}

// Functiom beriktu dalah digunakan untuk mendapatkan contract emploeye untuk ditamplkan dalam form update contract
//
function GetContract(accountId) {
    ClearScreenContract();
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
            $("#StartContract").val(formatDate(obj.startContract));
            $("#EndContract").val(formatDate(obj.endContract));
            $("#positionEmp").val(obj.position);


            //clear exsiting position
            $("#positionEmp").empty();

            // Add default "Choose Position" option
            $("#positionEmp").append($("<option>", {
                value: "",
                text: "Choose Position",
                selected: true, // Optionally set this option as selected
            }));

            // Create and append new options based on the selected level
            var positions = [
                "Fullstack Developer",
                "Back End Developer",
                "Business Analyst",
                "Business Intelligent Engineer",
                "Data Analyst",
                "Data Engineer",
                "Database Administrator",
                "Database Analyst",
                "Database Engineer",
                "Devops Engineer",
                "Developer",
                "Front End Developer",
                "Head of IT",
                "IT Admin",
                "IT Applications Support",
                "Manager",
                "Mobile Developer",
                "Outsystems Developer",
                "Project Manager",
                "Quality Assurance",
                "Sage 300 Consultant",
                "SAP ABAP Developer",
                "Scrum Master",
                "Software Engineer",
                "System Analyst",
                "UiPath Engineer",
                ".Net Developer"
            ];

            for (var i = 0; i < positions.length; i++) {
                var option = $("<option>", {
                    value: positions[i],
                    text: positions[i],
                    selected: positions[i] === obj.position,
                });
                $("#positionEmp").append(option);
            }
            compare = {
                Position: obj.position,
            };
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

//Function melakukan update contract dijalankan ketika admin klik update contract
function UpdateContract() {
    var table = $("#dataTableEmployee").DataTable();
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

    //validasi selectedPosition
    var selectedPosition = $("#positionEmp").val();

    if (!selectedPosition) {
        $(".positionEmp").closest(".form-group").find(".error-message").show();
        isValid = false;
    } else {
        $(".positionEmp").closest(".form-group").find(".error-message").hide();
    }


    if (!isValid) {
        return;
    }

    var Account = {
        accountId: $("#accountId").val(),
        startContract: $("#StartContract").val(),
        endContract: $("#EndContract").val(),
        position: $("#positionEmp").val()
    };

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
                text: "Data has been updated!",
                showConfirmButton: false,
                timer: 1500,
            });
            const logMessage = `Has updated contract Account ID ${Account.accountId}, starting from ${Account.startContract} to ${Account.endContract}`;
            SaveLogUpdate(logMessage);
            $("#modalContract").modal("hide");
            setTimeout(function () {
                location.reload();
                //table.ajax.reload();
            }, 1800); // 3000 milliseconds = 3 seconds
        } else {
            Swal.fire("Error!", "Data failed to update", "error");
            location.reload();
            //table.ajax.reload();
        }
    });
}

// Function berikut digunkan untuk mengupdate placement yang ada pada detail employee
// Dijalankan ketika admin klik tombol update pada form edit placement
function UpdatePlacement() {
    //table = $("#dataTableEmployee").DataTable()
    var Placement = new Object();
    Placement.accountId = $("#AccountId").val();
    Placement.placementStatusId = $("#PlacementID").val();
    Placement.placementStatus = $("#PlacementStatus").val();
    Placement.clientId = $("#CompanyName").val();
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
            location.reload();
        } else {
            Swal.fire("Error!", "Data failed to update", "error");
            location.reload();
        }
    });
}

function ClearScreenContract() {
    $("#AccountId").val("");
    $("#StartContract").val("");
    $("#EndContract").val("");
    $("positionEmp").val("");


    $("input[required], select[required]").each(function () {
        var input = $(this);

        input.next(".error-message-contract").hide();

    });

    // Menyembunyikan pesan kesalahan untuk kedua input
    $(".error-message-contract").hide();
    $(".error-message").hide();

  
 
}

function ClearScreenPlacement() {
    const startDate = document.getElementById("showStartDate");
    const endDate = document.getElementById("showEndDate");
    $("#companyName_").prop("selectedIndex", 0);
    $("#companyName_").trigger("change");
    $("#picName").val("");
    $("#picNameRas").val("");
    $("#jobRole").prop("selectedIndex", 0);
    $("#jobRole").trigger("change");
    $("#startDate").val("");
    $("#endDate").val("");
    $("#description").val("");
    $("#placementStatus").val("");
    $("#Update").hide();
    $("#Add").show();
    startDate.style.display = "block";
    endDate.style.display = "block";
    $("input[required]").each(function () {
        var input = $(this);

        input.next(".error-message").hide();
    });

    $('input[name="status"]').prop("checked", false);
    $(".error-message").hide();
}

function ClearScreenChangeStatus() {
    $("#AccountId").val("");

    $("#Status").selectedIndex = "0";
    $("#Status").val("");
    $("#date").val("");

    $("#Description").val("");

    $(".error-message, .error-message-turnOver, .error-message-dept").hide();
}


//Function berikut digunakan untuk menghandel save placement saat admin menambahkan penempatan baru untuk employee
//Function tersebut menerima parameter account id untuk di simpan berdasarkan account id pada table placement
function Save(accountId) {
    debugger;
    table = $("#dataTableEmployee").DataTable();
    var isValid = true;

    $("input[required], select[required]").each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next(".error-message").show();
            isValid = false;
        } else {
            input.next(".error-message").hide();
        }
    });

    //validasi selectedPosition
    var selectedCompanyName = $("#companyName_").val();

    if (!selectedCompanyName) {
        $(".selectedCompany").closest(".form-group").find(".error-message").show();
        isValid = false;
    } else {
        $(".selectedCompany").closest(".form-group").find(".error-message").hide();
    }

    //validasi status 
    var isCheckedStatus = $('input[type="radio"][name="status"]:checked').length > 0;

    if (!isCheckedStatus) {
        $('#err-status').show();
        isInvalid = false;
    } else {
        $('#err-status').hide();
    }

    if (!isValid) {
        return;
    }

    var placement = new Object(); //object baru
    placement.clientId = $("#companyName_").val();
    placement.positionId = $("#jobRole").val();
    placement.startDate = $("#startDate").val();
    placement.endDate = $("#endDate").val();
    placement.picName = $("#picName").val();
    placement.picRas = $("#picNameRas").val();
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
                location.reload();
            });
        } else {
            Swal.fire("Error!", "Data failed to added", "error");
        }
    });
}


//Function berikut digunakan untuk mengupdate placement atau penempatan 
//Berjalan ketika di klik update pada form edit placement
function Update() {

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
    //validasi selectedPosition
    var selectedCompanyName = $("#companyName_").val();

    if (!selectedCompanyName) {
        $(".selectedCompany").closest(".form-group").find(".error-message").show();
        isValid = false;
    } else {
        $(".selectedCompany").closest(".form-group").find(".error-message").hide();
    }

    //validasi status 
    var isCheckedStatus = $('input[type="radio"][name="status"]:checked').length > 0;

    if (!isCheckedStatus) {
        $('.error-message').show();
        isInvalid = false;
    } else {
        $('.error-message').hide();
    }




    var placement = new Object();



    placement.placementStatusId = $("#placementStatusId").val();
    placement.clientId = $("#companyName_").val();
    placement.positionId = $("#jobRole").val();
    placement.startDate = $("#startDate").val();
    placement.picName = $("#picName").val();
    placement.picRas = $("#picNameRas").val();

    placement.endDate = $("#endDate").val();
    if (placement.endDate == "") {
        placement.endDate = null;
    }
    placement.description = $("#description").val(); //value insert dari id pada input
    placement.placementStatus = $('input[name="status"]:checked').val();
    placement.accountId = $("#accountId").val();

    if (
        placement.clientId == compare.ClientId &&
        placement.positionId == compare.PositionId &&
        placement.endDate == compare.EndDate &&
        placement.picName == compare.PicName &&
        placement.picRas == compare.PicRas &&
        placement.description == compare.Description &&
        placement.placementStatus == compare.PlacementStatus
    ) {
        {
            const logMessage = `Updated employee placement data with no changes detected, Id ${placement.accountId}`;
            SaveLogUpdate(logMessage);
            Swal.fire({
                icon: "info",
                title: "No Changes Detected",
                text: "No data has been changed.",
                showConfirmButton: false,
                timer: 2000,
            });
            $("#modalPlacement").modal("hide");
            return;
        }
    }

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

//Function berikut digunakan unutk melihat asset employee
//Berjalan ketika admin klik view asset
//Menerima parameter account id yang digunakan untuk mendapatkan asset berdasarkan account id
function GetByIdAsset(id) {
    $.ajax({
        url:
            "https://localhost:7177/api/Assets/accountId?accountId=" +
            id,
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


//Function berikut digunakan untuk mengisi value level employee pada menu manage employee / manage resource
//Berjakan ketika admin klik level employee yang ada pada table manage resource
function GetbyLevel(accountId) {
    $.ajax({
        url:
            "https://localhost:7177/api/Employees/accountId?accountId=" + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var obj = result.data.result;
            $("#accountLevel").val(obj.accountId); //ngambil data dr api
            $("#levelchange").val(obj.level);
            $("#modalLevel").modal("show");
            // Clear existing options
            $("#levelchange").empty();

            // Create and append new options based on the selected level
            var levels = [
                "Fresh Graduate",
                "Junior",
                "Junior to Middle",
                "Middle",
                "Middle to Senior",
                "Senior",
            ];
            for (var i = 0; i < levels.length; i++) {
                var option = $("<option>", {
                    value: levels[i],
                    text: levels[i],
                    selected: levels[i] === obj.level,
                });
                $("#levelchange").append(option);
            }
            compare = {
                Level: obj.level,
            };
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

//Function berikut digunakan untuk mengirim data update ke server
//berjalan ketika admin klik button update saat mengedit form level employee
function UpdateLevel() {
    accountId = $("#accountLevel").val();
    level = $("#levelchange").val();
    levelData = { level: level };
    levelData = { level: level };
    if (levelData.level == compare.Level) {
        const logMessage = `Updated Level of Account ID ${accountId} with no changes detected`;
        SaveLogUpdate(logMessage);
        Swal.fire({
            icon: "info",
            title: "No Changes Detected",
            text: "No data has been changed.",
        });
        $("#modalLevel").modal("hide");
        return;
    }

    $.ajax({
        url: "https://localhost:7177/api/Employees/" + accountId,
        type: "PUT",
        data: JSON.stringify(levelData),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {

            // Handle success, for example, close the modal
            $("#modalLevel").modal("hide");
            if (result.status == 200) {
                const logMessage = `Has Changed Level of Account ID ${accountId}, Level ${level}`;
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
        },
    });
}

//Random Color
function getColorForWord(word) {
    if (!colorsByWord.hasOwnProperty(word)) {
        // Jika kata belum memiliki warna yang terkait, atur warna pastel secara urut
        colorsByWord[word] =
            pastelColors[Object.keys(colorsByWord).length % pastelColors.length];
    }
    return colorsByWord[word];
}

//Random Color
function getColorForPosition(word) {
    if (!colorsByWord.hasOwnProperty(word)) {
        // Jika kata belum memiliki warna yang terkait, atur warna pastel secara urut
        colorsByWord[word] =
            softlColors[Object.keys(colorsByWord).length % softlColors.length];
    }
    return colorsByWord[word];
}

//Function berikut dugunakan untuk menampilkan data client pada select placement
//Digunakan pada form add ataupun edit placement
function getPlacementLoc() {
    var selectPlacement = document.getElementById("selectPlacementLoc");

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
                    item.nameOfClient,
                    item.nameOfClient,
                    true,
                    false
                );
                selectPlacement.add(option);
            });
        }
    });

    $("#selectPlacementLoc").select2({
        placeholder: "Choose Placement",
        dropdownParent: $("#offcanvasRight"),
        width: "100%",
        height: "100%",
        allowClear: false,
        tags: true,
    });
}

//Function berikut digunakan untuk mendapatkan data position pada client
//Digunakan untuk ditampilkan pada select position
function getPosition() {
    var selectPosition = document.getElementById("selectPosition");

    $.ajax({
        type: "GET",
        url: "https://localhost:7177/api/Position",

        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        if (result != null) {

            const uniquePositions = new Set();

            result.data.forEach((item) => {
                // Tambahkan nilai posisi ke dalam Set
                uniquePositions.add(item.positionClient);

                // Buat option hanya jika posisi belum ada
                if (!selectPosition.querySelector(`option[value="${item.positionClient}"]`)) {
                    var option = new Option(
                        item.positionClient,
                        item.positionClient,
                        true,
                        false
                    );
                    selectPosition.add(option);
                }
            });
        }
    });

    $("#selectPosition").select2({
        placeholder: "Choose Position",
        dropdownParent: $("#offcanvasRight"),
        width: "100%",
        height: "100%",
        allowClear: false,
        tags: true,
    });
}

function closeLevel() {
    table.ajax.reload();
}

//Function berikut digunakan untuk menghandle reset filter
//Berjalan ketika admin klik tombol clear pada modal filter Data
function resetFilter() {
    $("#selectPosition").select2("val", $("#selectPosition option:eq(0)").val());
    $("#selectPlacementLoc").select2(
        "val",
        $("#selectPlacementLoc option:eq(0)").val()
    );
    $("input[type='radio']").prop("checked", false);

    filterPosition = "";
    filterLevel = "";
    filterHiredStatus = "";
    filterFinanIn = "";
    filterplacLoc = "";
    filterplacStatus = "";
    handleFilterSubmission();
    window.location.href = "/ManageEmployee/Index";
}

//Function berikut digunakan unutk menghandle Filter pada manage resource
//Menerima input dari modal filter kemudian mengirim ke server untuk di return data yang di minta
//Kemudian data yang di dapat langsung ditampilkan dalam bentuk table 
function handleFilterSubmission() {
    var filterPosition =
        $("#selectPosition").val() != null ? $("#selectPosition").val() : null;
    var filterLevel =
        $("input[type='radio'][name='filter-level']:checked").length > 0
            ? $("input[type='radio'][name='filter-level']:checked").val()
            : null;
    var filterHiredStatus =
        $("input[type='radio'][name='filter-Hired']:checked").length > 0
            ? $("input[type='radio'][name='filter-Hired']:checked").val()
            : null;
    var filterFinanIn =
        $("input[type='radio'][name='filter-financi']:checked").length > 0
            ? $("input[type='radio'][name='filter-financi']:checked").val()
            : null;
    var filterplacLoc =
        $("#selectPlacementLoc").val() != null
            ? $("#selectPlacementLoc").val()
            : null;
    var filterplacStatus =
        $("input[type='radio'][name='filter-placeStatus']:checked").length > 0
            ? $("input[type='radio'][name='filter-placeStatus']:checked").val()
            : null;

    //console.log(filterplacStatus);

    if ($.fn.DataTable.isDataTable("#dataTableEmployee")) {
        $("#dataTableEmployee").DataTable().destroy();
    }

    // Apply mixed filter
    var urlApi = "";

    urlApi =
        "https://localhost:7177/api/Employees/GetEmployeeFilter" +
        "?position=" +
        filterPosition +
        "&level=" +
        filterLevel +
        "&hiredStatus=" +
        filterHiredStatus +
        "&financialIndustry=" +
        filterFinanIn +
        "&placementStatus=" +
        filterplacStatus +
        "&placementLocation=" +
        filterplacLoc;

    // Make an AJAX request to a server endpoint (replace 'your_endpoint' with the actual URL)
    //console.log(urlApi);
    $("#dataTableEmployee")
        .on("processing.dt", function (e, settings, processing) {
            $("#loader").css("display", processing ? "block" : "none");
        })
        .DataTable({
            fixedColumns: {
                leftColumns: window.innerWidth > 1024 ? 3 : null,
            },
            paging: true,

            pagingType: "full_numbers",
            fixedHeader: true,
            scrollX: true,
            scrollY: true,
            // scrollCollapse: true,
            orderCellsTop: true,


            ajax: {
                url: urlApi,
                type: "GET",
                datatype: "json",
                async: true,
                dataSrc: "data",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
            },

          
            columns: [
                //Render digunakan untuk menampilkan atau memodifikasi isi sel (cell) pada kolom

                {
                    data: null,
                    width: "4%",
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1 + ".";
                    },
                },

                { data: "nik" },
                {
                    data: "fullname",
                    render: function (data, type, row) {
                        if (type === "display" || type === "filter") {
                            // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
                            var icon =
                                '<div class="row"><div class="col-4 text-left mr-5">' +
                                data +
                                '</div><div class="col text-right"><i class="fas fa-external-link-alt edit btn-edit-status" style="color: #ff0000;  visibility: hidden;" onclick="return GetByIdPlacement(\'' +
                                row.accountId +
                                "')\"></i>";

                            // Validasi manager hide action (Only View)
                            var objDataToken = parseJwt(sessionStorage.getItem("Token"));
                            if (objDataToken.RoleId == 7) {
                                $(".btn-edit-status, .edit").hide();
                            }

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
                {
                    data: "position",
                    render: function (data) {
                        if (data == null) {
                            var a = "";
                            return a;
                        }

                        var posisitionSplit = data.split(",");

                        var badgeContainer = $('<div class="badge-container"></div>');

                        for (var i = 0; i < posisitionSplit.length; i++) {
                            var word = posisitionSplit[i].trim();
                            var badgeColor = getColorForPosition(word);
                            var badge = $(
                                '<span class="badge rounded-pill badge-pastel text-secondary">' +
                                word +
                                "</span>"
                            );

                            // Atur warna latar belakang badge sesuai dengan kata yang sama
                            badge.css("background-color", badgeColor);

                            badgeContainer.append(badge);
                            if (i < posisitionSplit.length - 1) {
                                badgeContainer.append(" ");
                            }
                        }
                        // Kembalikan HTML dari container badge
                        return badgeContainer.html();
                    },
                },
                {
                    data: "level",
                    render: function (data, type, row) {
                        var levelStatus = row.level;

                        // Validasi manager hide action (Only View)
                        var objDataToken = parseJwt(sessionStorage.getItem("Token"));
                        if (objDataToken.RoleId == 7) {
                            return data;
                        }

                        if (levelStatus === "Fresh Graduate") {
                            return (
                                '<span type="button" class="badge rounded-pill badge-dark" data-toggle="modal" data-bs-target="#modalLevel" onclick="GetbyLevel(\'' +
                                row.accountId +
                                "')\">" +
                                row.level +
                                "</span>"
                            );
                        } else if (
                            levelStatus === "Junior" ||
                            levelStatus === "Junior to Middle" ||
                            levelStatus === "Middle to Senior"
                        ) {
                            return (
                                '<span type="button" class="badge rounded-pill badge-danger" data-toggle="modal" data-bs-target="#modalLevel" onclick = "GetbyLevel(\'' +
                                row.accountId +
                                "')\">" +
                                row.level +
                                "</span>"
                            );
                        } else {
                            return (
                                '<span type="button" class="badge rounded-pill badge-primary" data-toggle="modal" data-bs-target="#modalLevel" onclick="GetbyLevel(\'' +
                                row.accountId +
                                "')\">" +
                                row.level +
                                "</span>"
                            );
                        }
                    },
                },
                { data: "email" },
                { data: "gender" },
                { data: "address" },
                {
                    data: "financialIndustry",
                    render: function (data, type, row) {
                        if (type === "display") {
                            // Jika data bernilai true, tambahkan atribut checked

                            var isChecked =
                                data === "true" || data === "True" ? "checked" : "";

                            return (
                                '<input type="checkbox" class="financialIndustry" id="financialIndustryCheck" ' +
                                isChecked +
                                ">"
                            );
                        }
                        return data;
                    },
                    className: "text-center",
                },
                {
                    render: function (data, type, row) {
                        //var accountId = row.accountId;
                        var placementStatus = 'Idle'; // Default value jika data tidak ditemukan

                        row.placements.forEach(function (placement) {
                            if (placement.placementStatus !== "Idle") {
                                placementStatus = placement.placementStatus;
                            }
                        });
                        //console.log(placementStatus);
                        if (placementStatus == "Idle") {
                            /*placementStatus =
                                                                      '<span class="badge rounded-pill badge-warning" style="outline: none; border:none"  data - placement="right" data - toggle="modal" data - animation="false" title="Edit" onclick="return GetByIdPlacement(\'' +
                                                                      row.accountId +
                                                                      "', 'Idle')\">Idle</button>";*/
                            placementStatus =
                                '<span class="badge rounded-pill badge-warning" style="outline: none; border:none">Idle</span>';
                        } else {
                            /*placementStatus =
                                                                      '<button class="badge rounded-pill badge-success" style="outline: none; border:none" data - placement="right" data - toggle="modal" data - animation="false" title="Edit">' +placementStatus +'</button>';*/
                            placementStatus =
                                '<span class="badge rounded-pill badge-success" style="outline: none; border:none">' +
                                placementStatus +
                                "</span>";
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
                                placementLocation = placement.clientId;
                            }
                        });

                        if (placementStatus == "Idle") {
                            placementLocation = "";
                        } else {
                            $.ajax({
                                url:
                                    "https://localhost:7177/api/ClientName/" + placementLocation, // URL API yang diinginkan
                                type: "GET",
                                async: false, // Tunggu hingga permintaan selesai (opsional, bisa diubah)
                                headers: {
                                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                                },
                                success: function (response) {
                                    placementLocation = response.data.nameOfClient;
                                },
                                error: function (xhr, status, error) {
                                    console.error(xhr.responseText);
                                },
                            });
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


                        var monthsRemaining = Math.floor(daysremain / 30); // Menghitung bulan
                        var daysInMonth = daysremain % 30; // Menghitung sisa hari
                       
                        var result = "";

                     
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
                    width: "7%",
                    render: function (data, type, row) {
                        return (
                            '<div class="d-flex flex-row">' +
                            '<a href="#" class="text-danger ml-2 pt-0" data-toggle="tooltip" style="font-size: 14pt" data-placement="left" data-tooltip="tooltip" title="Curiculum Vitae" onclick = "GenerateCv(\'' +
                            row.accountId +
                            '\')"><i class="far fa-file-pdf"></i></a>' +
                            '<a href="#" class="ml-1 pt-0 text-primary" data-toggle="tooltip" style="font-size: 14pt" data-placement="left" data-tooltip="tooltip" title="Time Sheet" onclick = "TimeSheetView(\'' +
                            row.accountId +
                            '\')"><i class="far fa-calendar-check"></i></a>' +
                            '<a href="#" class="btn  ml-1 btn-sm p-0 text-info"  style="font-size: 14pt" data-bs-toggle="modal" data-placement="left" data-tooltip="tooltip" title="Detail Employee" onclick = "return Detail(\'' +
                            row.accountId +
                            '\')"><i class="far fa-edit"></i></a>' +
                            "</div>"
                        );
                    },
                    //visible: objDataToken.RoleId != 7,
                },
            ],
            order: [2, 'asc'],
            columnDefs: [
                {
                    defaultContent: "-",
                    targets: "_all",
                },
            ],
           
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
}

function formatDate(dateString) {
    // Pisahkan tanggal dan waktu jika diperlukan
    var parts = dateString.split('T')[0].split('-');

    // Buat string baru dengan urutan tanggal, bulan, dan tahun yang diubah
    var formattedDate = parts[0] + '-' + parts[1] + '-' + parts[2];

    // Kembalikan tanggal yang telah diformat
    return formattedDate;
}