// Approval.js ini secara garis besar berhubungan dengan manage approval pada menu Admin. ( Halaman Manage Approval)
// Digunakan admin untuk approve ataupun reject timesheet overtime
// Ketika admin melakukan approve overtime timesheet employee tersebut data akan di input ke dalam table timesheet employee
// Jika Reject maka data tidak akan diteruskan ke dalam table timesheet, dan hanya berada di table approval dengan status reject

var month;
var accountId;
var table;


$(document).ready(function () {
    // Load Table Approval, memanggil function tableApproval.
    tableApproval();
});

// Function get by id ini digunaka, untuk menagmbil data Approval berdasarkan Id, data Employee dan data placement berdasarkan Account Id
// Digunakan untuk mengisi form timesheet Approval di button edit pada menu Overtime Approval
function GetById(Id) {
    $.ajax({
        url: "https://localhost:7177/api/Approval/" + Id,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            
            var obj = result.data;

            // Set previous status approval
            $("#prevStatusApproval").val(obj.statusApproval)

            // Mengambil accountId dari data Approval
            var accountId = obj.accountId;

            // Mengambil data Employee berdasarkan accountId, parameter yang diterima adalah account id
            // Account Id tersebut di dapat dari object data Approval
            $.ajax({
                url: "https://localhost:7177/api/Employees/accountId?accountId=" + accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                success: function (employeeResult) {
                 
                    var employeeObj = employeeResult.data.result;
                    $("#fullName").val(employeeObj.fullname);
                },
                error: function (errormessage) {
                    alert(errormessage.responseText);
                }
            });

            //Get CompanyName (Placement) berdasarkan account Id, data yang didapat adalah data placement.
            //Kemudian digunakan untuk mengisi value company name dan lastPlacementId pada form Overtime Approval
            $.ajax({
                url:
                    "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" + accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                success: function (result) {
                    var obj = result.data;
                    if (obj && obj.length > 0) {
                        var lastData = obj[0];
                        $("#compName").val(lastData.client.nameOfClient);
                        $("#lastPlacementId").val(lastData.placementStatusId);
                    } else {
                        console.log("Tidak ada data");
                    }
                },
                error: function (errormessage) {
                    alert(errormessage.responseText);
                },
            });

            $("#approvalId").val(obj.id); 
            $("#lastPlacementId").val(obj.placementStatusId);
            $("#accountId").val(obj.accountId);
            $("#activity").val(obj.activity).attr(obj.activity);
            $("#activity").prop('disabled', true);
            $("#inputDate").val(obj.date.substring(0, 10));
            $("#inputDate").prop('disabled', true);
            $("#flag").val(obj.flag).attr(obj.flag);
            $("#flag").prop("disabled", true);
            $("#category").val(obj.category).attr(obj.category);
            $("#category").prop('disabled', true);
            $("#status").val(obj.status).attr(obj.status);
            $("#status").prop('disabled', true);
            $("#knownBy").val(obj.knownBy).attr(obj.knownBy);
            $("#knownBy").prop('disabled', true);
            $("#statusApproval").val(obj.statusApproval).attr(obj.statusApproval);
            $("#notes").val(obj.notes);
            $("#notes").prop('disabled', false);
            $("#ApprovalModal").modal("show");
            $("#Update").show();

            $(".required").remove();

            $("#ApprovalModal").modal("show");
            $("#Save").hide();
            $("#Update").show();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

// Functuon ini digunakan untuk mengupdate atau melakukan aksi perubahan pada form Timesheet Approval
// Data approval yang disetujui akan diteruskan atau di masukan kedalam table timesheet
function Update() {
    var placementStatusId = $("#lastPlacementId").val();
    var Approval = new Object();
    var flag = $("#flag").val();
    var OT = "Overtime ";
    var newValue = OT + flag;
    Approval.Id = $("#approvalId").val();
    Approval.Date = $("#inputDate").val();
    Approval.Activity = $("#activity").val();
    Approval.Flag = newValue;
    /*Approval.Flag = $("#flag").val();*/
    Approval.Category = $("#category").val();
    Approval.Status = $("#status").val();
    Approval.KnownBy = $("#knownBy").val();
    Approval.StatusApproval = $("#statusApproval").val();
    Approval.placementStatusId = placementStatusId;
    Approval.accountId = $("#accountId").val()

    Approval.notes = $('#notes').val()
 


    // Check apakah Status Approval berubah dari On Progress menjadi Approve
    var prevStatusApproval = $("#prevStatusApproval").val();
    if (prevStatusApproval == "On Progress" && Approval.StatusApproval == "Approve") {
        // Buat salinan data kecuali Status Approval
        var TimeSheetData = {
            Date: Approval.Date,
            Activity: Approval.Activity,
            Flag: Approval.Flag,
            Category: Approval.Category,
            Status: Approval.Status,
            KnownBy: Approval.KnownBy,
            placementStatusId: placementStatusId,
            accountId: Approval.accountId
        };

        // Jika status timesheet pada table approval berubah menjadi approve maka akan di input kealam table Timesheet
        // Kemudian Timesheet tersebut akan berstatus Overtime WFH / WFO
        $.ajax({
            url: "https://localhost:7177/api/TimeSheet/AddTimeSheet",
            type: "POST",
            data: JSON.stringify(TimeSheetData),
            contentType: "application/json; charset=utf-8",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            success: function (result) {
                console.log(result);
                if (result.status == 200) {
                    // Jika berhasil, lanjutkan dengan update data Approval untuk melakukan perubaha status pada approval
                    updateApproval(Approval);
                } else {
                    // Tampilkan pesan error jika gagal
                    Swal.fire("Error!", "Failed to add timesheet", "error");

                }
            },
            error: function () {
                // Tampilkan pesan error jika gagal
                Swal.fire("Error!", "Failed to add timesheet", "error");
            }
        });
    } else {
        // Jika Status Approval tidak berubah, lanjutkan dengan update data Approval
        updateApproval(Approval);
    }
}

// Fungsi untuk mengirim data Approval ke endpoint API Approval untuk diupdate
function updateApproval(Approval) {
    console.log(Approval);
    $.ajax({
        url: "https://localhost:7177/api/Approval",
        type: "PUT",
        data: JSON.stringify(Approval),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            if (result.status == 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success...",
                    text: "Data has been updated!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                const logMessage = `Has ${Approval.StatusApproval},Timesheet Date ${Approval.Date}, Account Id: ${Approval.accountId}`;

                // Save Log Update ini dugunakan untuk menyimpan log aktivitas sesuai pesan yang di definisikan
                // Function SavelogUpdate berada pada file HistoryLog.js
                // log message akan dikirim ke function tersebut kemudian dilakukan penyimpanan ke dalam table history log
                SaveLogUpdate(logMessage);
                $("#ApprovalModal").modal("hide");
                $("#ApprovalTable").DataTable().ajax.reload();
            } else if (result.status == 400) {
                Swal.fire({
                    icon: "warning",
                    title: "Failed",
                    text: "Flag with the same date can't be the same!",
                    showConfirmButton: true,
                });
            } else {
                Swal.fire("Error!", "Failed to update data", "error");
            }
            table.columns.adjust().draw();
        },
        error: function () {
            Swal.fire("Error!", "Failed to update data", "error");
        }
    });
}


function clearScreen() {
    $("#activity").val("");
    document.getElementById("flag").selectedIndex = 0;
    document.getElementById("category").selectedIndex = 0;
    document.getElementById("status").selectedIndex = 0;
    $("#knownBy").val("");
    $("#Update").hide();
    $("#Save").show();
}

// Function ini digunakan untuk mem parse token JWT untuk digunakan sesuai kebutuhan seperti mendapatkan email atau role dll
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


// Event click ini digunakan untuk mentriger perpindahan navigasi di halaman Overtime Approval pada Navigasi Table "Approval"
document.getElementById("needApproval").onclick = function (event) {

    var needApprov = document.getElementById("needApproval");
    var historyApprov = document.getElementById("historyApproval");

    needApprov.classList.add("active");
    historyApprov.classList.remove("active");
    event.preventDefault(); // Mencegah perpindahan halaman ketika tautan diklik

    tableApproval();

};

// Event click ini digunakan untuk mentriger perpindahan navigasi History Approval
// Berada pada halaman Approval Overtime, ketika ingin melakukan perpindahan navigasi history approval
// untuk memunculkan data seluruh data approval
// Berisi juga get data employee yang digunakan untuk memunculkan nama pada table
document.getElementById("historyApproval").onclick = function (event) {

    var needApprov = document.getElementById("needApproval");
    var historyApprov = document.getElementById("historyApproval");

    needApprov.classList.remove("active");
    historyApprov.classList.add("active");
    event.preventDefault(); // Mencegah perpindahan halaman ketika tautan diklik



    var urlParams = new URLSearchParams(window.location.search);
    accountId = urlParams.get("accountId");

    // Hancurkan atau bersihkan tabel sebelum menginisialisasi kembali
    if ($.fn.DataTable.isDataTable('#ApprovalTable')) {
        $('#ApprovalTable').DataTable().destroy();
    }

    table = $("#ApprovalTable").DataTable({
        scrollX: true,
        order: [1, "asc"],
        ajax: {
            url:
                "https://localhost:7177/api/Approval",
            type: "GET",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            dataSrc: function (json) {
                // Menghapus data dengan status "On Progress"
                return json.data.filter(function (item) {
                    return item.statusApproval !== "On Progress";
                });
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
                data: "accountId",
                render: function (data) {
                    let name = null;
                    $.ajax({
                        url: "https://localhost:7177/api/Employees/accountId?accountId=" + data,
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        async: false,
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("Token"),
                        },
                        success: function (employeeResult) {
                            name = employeeResult.data.result.fullname ?? ""
                        },
                        error: function (errormessage) {
                            name = ""
                        }
                    })
                    return name
                }
            },
            {
                data: "date",
                render: function (data) {
                    var dateObj = new Date(data);
                    var day = dateObj.getDate();
                    var month = dateObj.getMonth() + 1;
                    var year = dateObj.getFullYear();
                    var formatDate = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + year;
                    return formatDate;
                }
            },
            { data: "activity" },
            { data: "flag" },
            { data: "category" },
            { data: "status" },
            { data: "knownBy" },
            {
                data: "statusApproval",
                render: function (data) {
                    if (data === "Approve") {
                        return `${data}d`
                    }
                    return `${data}ed`
                }

            },
            { data: "notes" },
            { data: null}
        ],
        order: [[2, "desc"]],
        columnDefs: [
            {
                targets: [0, 3, 4, 5, 6, 7, 8,9],
                orderable: false,
            },
            {
                target: 10,
                visible: false,
                searchable: false
            },
        ],
        createdRow: function (row, data, dataIndex) {

        },
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

    table.column(10).visible(false);
};

// Function untuk view table approval yang berstatus OnProgress untuk ditampilkan ketika halaman Approval Overtime dimuat
function tableApproval() {

    // Hancurkan atau bersihkan tabel sebelum menginisialisasi kembali
    if ($.fn.DataTable.isDataTable('#ApprovalTable')) {
        $('#ApprovalTable').DataTable().destroy();
    }

    table = $("#ApprovalTable").DataTable({
        scrollX: true,
        order: [2, "desc"],
        ajax: {
            url:
                "https://localhost:7177/api/Approval",
            type: "GET",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            dataSrc: function (json) {
                // Menghapus data dengan status "On Progress"
                return json.data.filter(function (item) {
                    return item.statusApproval == "On Progress";
                });
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
                data: "accountId",
                render: function (data) {
                    let name = null;
                    $.ajax({
                        url: "https://localhost:7177/api/Employees/accountId?accountId=" + data,
                        type: "GET",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        async: false,
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("Token"),
                        },
                        success: function (employeeResult) {
                            name = employeeResult.data.result.fullname ?? ""
                        },
                        error: function (errormessage) {
                            name = ""
                        }
                    })
                    return name
                }
            },


            {
                data: "date",
                render: function (data) {
                    var dateObj = new Date(data);
                    var day = dateObj.getDate();
                    var month = dateObj.getMonth() + 1;
                    var year = dateObj.getFullYear();
                    var formatDate = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + year;
                    return formatDate;
                }
            },
            { data: "activity" },
            { data: "flag" },
            { data: "category" },
            { data: "status" },
            { data: "knownBy" },
            { data: "statusApproval" },
            { data: "notes" },
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                data: null,
                render: function (data, type, row) {
                    var modalId = "modal-edit-" + data.id;

                    return (
                        '<a class="text-warning ' +
                        '" data-placement="left" style="font-size: 14pt"data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' +
                        row.id +
                        ')"><i class="fa fa-edit edit-client"></i></a>' +
                        "&nbsp;"
                    );
                },
            },
        ],

        columnDefs: [
            {
                targets: [0, 3, 4, 5, 6, 7, 8, 9, 10],
                orderable: false,
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
};