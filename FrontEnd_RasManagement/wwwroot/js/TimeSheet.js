//var table = null;
var month;
var accountId;
$(document).ready(function () {

    var urlParams = new URLSearchParams(window.location.search);
    accountId = urlParams.get("accountId");

    //Employee Info
    getEmployee(accountId)
        .then(function (employee) {
            $('#fullName').text(employee.fullname);
            $('#fullNamePreview').text(employee.fullname);
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



  /*  $('#download-button').on('click', function () {
        // Memuat konten header dari file header.html
        $.get('TimeSheetToPdf', function (headerContent) {
            // Menggabungkan konten header dengan konten DataTables
            var finalContent = headerContent + $('#timeSheetTable').html();

            // Membuat PDF menggunakan HTML2PDF
            html2pdf().from(finalContent).save();
        });
    });*/
   
})






function submitMonth() {

    var urlParams = new URLSearchParams(window.location.search);
    accountId = urlParams.get("accountId");
    month = $("#month").val();

    if (month !== "") {
        //GET datatable
        document.getElementById('badgeDisplay').hidden = true;
        document.getElementById('tableTimeSheet').hidden = false;
        if ($.fn.DataTable.isDataTable("#timeSheetTable")) {
            $("#timeSheetTable").DataTable().destroy();
        }
        table = $("#timeSheetTable").DataTable({
            responsive: true,
            ajax: {
                url: "https://localhost:7177/api/TimeSheet/TimeSheetByAccountIdAndMonth?accountId="+accountId+"&month="+month,
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
               
            ]
        });
         //document.getElementById('badgeDisplay').hidden = true;
  
        
    } else {
        document.getElementById('badgeDisplay').hidden = false;
        document.getElementById('tableTimeSheet').hidden = true;
    }

    document.getElementById('previewPDF').addEventListener('click', function () {
     
    window.location.href = '/TimeSheets/Timesheettopdf';
       
        console.log(accountId);
     

    });
   
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

function openPreviewPdf() {
    

    var urlParams = new URLSearchParams(window.location.search);
    accountId = urlParams.get("accountId");
    var pdfURL = '/TimeSheets/Timesheettopdf?accountId='+accountId; // Ganti dengan URL PDF Anda
    var urlParams = new URLSearchParams(window.location.search);
    debugger;
    accountId = urlParams.get("accountId");
        getEmployee(accountId)
            .then(function (employeeData) {
                // Mendapatkan elemen berdasarkan ID dan mengisikan data Employee ke dalamnya
                var fullNameElement = document.getElementById('fullNamePreview');
                fullNameElement.textContent = employeeData.fullName; // Mengisikan nama lengkap ke elemen
          
                // Membuka PDF dalam tab baru saat tombol diklik
                window.open(pdfURL, '_blank');
            })
            .catch(function (error) {
                console.error('Error:', error);
            });

   var table = $("#timeSheetTablePdf").DataTable({
        responsive: true,
       
        ajax: {
            url: "https://localhost:7177/api/TimeSheet/TimeSheetByAccountIdAndMonth?accountId=" + accountId + "&month=" + month,
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

        ]
    });
}