//var table = null;
var month;
var accountId;
var table;

$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    accountId = urlParams.get("accountId");

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
        },
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1 + ".";
                },
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
        order: [[1, "asc"]],
        columnDefs: [
            {
                targets: [0, 2, 3, 4, 5, 6, 7, 8],
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
});

function GetById(Id) {
    //debugger;

    $.ajax({
        url: "https://localhost:7177/api/Approval/" + Id,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        /*headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },*/
        success: function (result) {
            //debugger;
            var obj = result.data;

            // Mengambil accountId dari data Approval
            var accountId = obj.accountId;

            // Mengambil data Employee berdasarkan accountId
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

            //Get CompanyName (Placement)
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

            $("#approvalId").val(obj.id); //ngambil data dr api
            $("#lastPlacementId").val(obj.placementStatusId);
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

function Update() {
    //debugger;

    var Approval = new Object();
    Approval.Id = $("#approvalId").val();
    Approval.Date = $("#inputDate").val();
    Approval.Activity = $("#activity").val();
    Approval.Flag = $("#flag").val();
    Approval.Category = $("#category").val();
    Approval.Status = $("#status").val();
    Approval.KnownBy = $("#knownBy").val();
    Approval.statusApproval = $("#statusApproval").val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Approval.accountId = accid;
    
    $.ajax({
        url: "https://localhost:7177/api/Approval",
        type: "PUT",
        data: JSON.stringify(Approval),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        // debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been update!",
                showConfirmButton: false,
                timer: 1500,
            });
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
            Swal.fire("Error!", "Your failed to update", "error");
            table.ajax.reload();
        }
        table.columns.adjust().draw();
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

/*function getEmployee(accountId) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url:
                "https://localhost:7177/api/Employees/accountId?accountId=" + accountId,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            *//*headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },*//*
            success: function (result) {
                var obj = result.data.result;
                resolve(obj);
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            },
        });
    });
}

function getPlacement(accountId) {
    return new Promise(function (resolve, reject) {
        //Get CompanyName (Placement)
        $.ajax({
            url:
                "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" +
                accountId,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
           *//* headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },*//*
            success: function (result) {
                var obj = result.data;
                if (obj && obj.length > 0) {
                    var lastData = obj[0];

                    resolve(lastData);
                } else {
                    console.log("Tidak ada data");
                }
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            },
        });
    });
}*/
