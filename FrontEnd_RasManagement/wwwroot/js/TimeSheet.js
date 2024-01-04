var table = null;
$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    accountId = urlParams.get("accountId");

    //Employee Info
    getEmployee(accountId)
        .then(function (employee) {
            $('#fullName').text(employee.fullname);
        })
        .catch(function (error) {
            alert(error);
        });
    //Placment Comp Name
    getPlacement(accountId)
        .then(function (employee) {
            $('#compName').text(employee.companyName);
        })
        .catch(function (error) {
            alert(error);
        });
  
   

    $("#backButton").on("click", function () {
        history.back(); // Go back to the previous page
    });
})






function submitMonth() {
    var urlParams = new URLSearchParams(window.location.search);
    accountId = urlParams.get("accountId");
    var month = $("#month").val();
    table = $("#timeSheetTable").DataTable({
        ajax: {
            url: "https://localhost:7177/api/TimeSheet/accountId?accountId=" + accountId, // Your API endpoint
            type: "GET",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            dataSrc: function (response) {
                if (!response || response.length === 0) {
                    document.getElementById('badgeDisplay').hidden = true;
                    $('#timeSheetTable').html('<p>No data available</p>');
                }
                return response;
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
                        '<button class="btn btn-warning " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' +
                        row.certificateId +
                        ')"><i class="fa fa-edit"></i></button >' +
                        "&nbsp;" +
                        '<button class="btn btn-danger" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(' +
                        row.certificateId +
                        ')"><i class="fa fa-trash"></i></button >'
                    );
                },
            },
        ]
    });

    document.getElementById('tableTimeSheet').hidden = false;
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


function getEmployee(accountId) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "https://localhost:7177/api/Employees/accountId?accountId=" + accountId,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            success: function (result) {
                var obj = result.data.result;
                resolve(obj);


            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            },
        });
    })
}


function getPlacement(accountId) {
    return new Promise(function (resolve, reject) {
        //Get CompanyName (Placement)
        $.ajax({
            url: "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" + accountId,
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

                    resolve(lastData);
                } else {
                    console.log('Tidak ada data');
                }

            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            },
        });
    })
}