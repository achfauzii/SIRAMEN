var table = null;
$(document).ready(function () {
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    $.ajax({
        url: "https://localhost:7177/api/Employees/accountId?accountId=" + accid,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var obj = result.data.result;

            $('#fullName').text(obj.fullname);

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
    //Get CompanyName (Placement)
    $.ajax({
        url: "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" + accid,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var obj = result.data;
            var obj = result.data;
            if (obj && obj.length > 0) {
                var lastData = obj[0];
                $('#compName').text(lastData.companyName);
            } else {
                console.log('Tidak ada data');
            }

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });

    //GET datatable
    table = $("#timeSheetTable").DataTable({
        ajax: {
            url: "https://localhost:7177/api/TimeSheet/accountId?accountId=" + accid, // Your API endpoint
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
                render: function (data, type, row) {
                    if (type === "display" || type === "filter") {
                        // Format tanggal dalam format yang diinginkan
                        return moment(data).format("DD MMMM YYYY");
                    }
                    // Untuk tipe data lain, kembalikan data aslinya

                    return data;

                },
            },
            { data: "activity" },
            { data: "flag" },
            { data: "category" },
            { data: "status" },
            { data: "knownBy" },
            {
                data: null,
                render: function (data, type, row) {
                    return (
                        '<button class="btn btn-sm btn-warning mr-2 " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return getById(' +
                        row.id +
                        ')"><i class="fa fa-edit"></i></button >'
                    );
                },
            },
        ]
    });
})

function getById(Id) {
    $.ajax({
        url: "https://localhost:7177/api/TimeSheet/" + Id,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            //debugger;
            var obj = result.data; //data yg dapet dr id
            console.log(result.data);
            $("#timeSheetId").val(obj.id); //ngambil data dr api
            $("#activity").val(obj.activity);
            $("#date").val(obj.date);
            console.log(obj.date);
            $("#flag").val(obj.flag);
            $("#category").val(obj.category);
            $("#status").val(obj.status);
            $("#knownBy").val(obj.knownBy);
            $("#timeSheetModal").modal("show");
            $("#Save").hide();
            $("#Update").show();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

function Update() {
    // debugger;
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
    var TimeSheet = new Object();
    TimeSheet.Id = $("#timeSheetId").val();
    TimeSheet.Date = $("#date").val();
    TimeSheet.Activity = $("#activity").val();
    TimeSheet.Flag = $("#flag").val();
    TimeSheet.Category = $("#category").val();
    TimeSheet.Status = $("#status").val();
    TimeSheet.KnownBy = $("#knownBy").val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    TimeSheet.accountId = accid;

    $.ajax({
        url: "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" + accid,
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
                TimeSheet.PlacementStatusId = lastData.placementStatusId;
            } else {
                console.log('Tidak ada data');
            }

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });

    $.ajax({
        url: "https://localhost:7177/api/TimeSheet",
        type: "PUT",
        data: JSON.stringify(TimeSheet),
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
            $("#timeSheetModal").modal("hide");
            table.ajax.reload();
        } else {
            Swal.fire("Error!", "Your failed to update", "error");
            table.ajax.reload();
        }
    });
}

function save() {

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
    debugger;
    const date = new Date();
    var TimeSheet = new Object();
    TimeSheet.Date = formatDate(Date());
    TimeSheet.Activity = $("#activity").val();
    TimeSheet.Flag = $("#flag").val();
    TimeSheet.Category = $("#category").val();
    TimeSheet.Status = $("#status").val();
    TimeSheet.KnownBy = $("#knownBy").val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    TimeSheet.AccountId = accid;

    //get placement status id
    $.ajax({
        url: "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" + accid,
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
                TimeSheet.PlacementStatusId = lastData.placementStatusId;
            } else {
                console.log('Tidak ada data');
            }

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });

    $.ajax({
        type: "POST",
        url: "https://localhost:7177/api/TimeSheet",
        data: JSON.stringify(TimeSheet),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        if (result.status == 200) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been added!",
                showConfirmButtom: false,
                timer: 1500,
            });
            $("#timeSheetModal").modal("hide");
            table.ajax.reload();
            clearScreen();
        } else {
            Swal.fire({
                icon: "warning",
                title: "Data failed to added!",
                showConfirmButtom: false,
                timer: 1500,
            });
            $("#timeSheetModal").modal("hide");
            table.ajax.reload();
        }
    });
    function formatDate(date) {
        var d = new Date(date),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
    }
}

function clearScreen() {
    $("#activity").val("");
    document.getElementById('flag').selectedIndex = 0;
    document.getElementById('category').selectedIndex = 0;
    document.getElementById('status').selectedIndex = 0;
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