// A $( document ).ready() block.
var table;
$(document).ready(function () {
    
    $("#companySelect").select2({
        placeholder: "Choose...",

        allowClear: false,
       
    });
    $.ajax({
        url: "https://localhost:7177/api/ClientName/ClientNameWithStatusOnsite", 
        method: "GET",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (data) {
            // Create a Set to store unique company names
            var placements = data.data;
        /*    var uniqueCompanyNames = new Set();

            // Iterate over the data and add unique company names to the Set
            for (var i = 0; i < placement.length; i++) {
                uniqueCompanyNames.add(placement[i].companyName);
            }*/
    
            // Create <option> elements based on unique company names and append them to the select
            placements.forEach(function (placement) {
                var option = $("<option>")
                    .val(placement.nameOfClient)  // Set the value attribute
                    .text(placement.nameOfClient);
                $("#companySelect").append(option);
            });
        },
        error: function (error) {
            console.error("Error fetching data from API:", error);
        }
    });

    $('#submitBtn').click(function (event) {
        event.preventDefault(); // Prevent default form submission behavior
        submitReportTimesheet();
    });

    $(document).on('select2:open', () => {
        document.querySelector('.select2-search__field').focus();
    });


});
   
   


function submitReportTimesheet() {

    var companyName = $('#companySelect').val();
    var month = $('#month').val();
    $("#nullInput").hide();
    var report = $('#reportTimesheet');

    // Check if companyName or month is empty or null
    if (!companyName || !month) {
        // Show the warning alert
        $("#nullInput").show();

   
        report.hide();
        return;
    }
    report.show();

    var downloadUrl = "/TimeSheetPdf/GeneratePdf?companyName=" + encodeURIComponent(companyName) + "&month=" + encodeURIComponent(month);

    // Memperbarui atribut href tautan unduhan dengan URL yang baru
    $("#btn-report").attr("href", downloadUrl);

    // Menampilkan tombol unduh
    $("#btn-report").show();



    if ($.fn.DataTable.isDataTable('#reportTimesheetTable')) {
        $('#reportTimesheetTable').DataTable().destroy();
    }
   table = new $('#reportTimesheetTable').DataTable({
        ajax: {
            url: 'https://localhost:7177/api/TimeSheet/GetTimeSheetByCompanyNameAndMonth?companyName=' + companyName + '&month=' + month,
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
            { data: 'accountName' },
            { data: 'wfoCount' },
            { data: 'wfhCount' },
               {
                   data: null,
                   orderable: false, // menonaktifkan order
                   width: "7%",
                   render: function (data, type, row) {
                       return (
                           '<div class="d-flex flex-row">' +
                           '<a href="#" class="ml-1 pt-0 text-primary" data-toggle="tooltip" style="font-size: 14pt" data-placement="left" data-tooltip="tooltip" title="Detail" onclick = "detailRecap(\'' +
                           row.accountId + '\', \'' + month + '\', \'' + row.accountName +
                           '\')"><i class="fas fa-info-circle"></i></a>'+
                           "</div>"
                       );
                   },
               },
  
       ],
       order: [1, 'asc'],
       columnDefs: [
           {
               targets: [0],
               orderable: false,
           },
       ],
       //Agar nomor tidak berubah
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
       initComplete: function (settings, json) {
           // Cek apakah tabel memiliki data
           if (table.data().count() === 0) {
               // Jika tidak ada data, sembunyikan tombol
               $("#btn-report").hide();
           } else {
               // Jika ada data, tampilkan tombol
               $("#btn-report").show();
           }
       }

       
      
    });


}

function detailRecap(accountId, month, name) {
    $("#informationAccountModal").modal("show");
    document.getElementById('nameEmp').textContent = name;
    document.getElementById("tableTimeSheet").hidden = false;
    if ($.fn.DataTable.isDataTable("#timeSheetTable")) {
        $("#timeSheetTable").DataTable().destroy();
    }
    $.ajax({
        url:
            "https://localhost:7177/api/TimeSheet/TimeSheetByAccountIdAndMonth?accountId=" +
            accountId +
            "&month=" +
            month,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (response) {
            var data = response.data;
            table = $("#timeSheetTable").DataTable({
                data: data,
                responsive: true,
                columns: [
                    {
                        name: "one",
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
                    { name: "two", data: "flag" },
                    { data: "category" },
                    { data: "status" },
                    { data: "knownBy" },
                ],
                rowsGroup: ["one:name", "two:name"],
                order: [[0, "asc"]],
                // backgroud warna dengan flag holiday
                createdRow: function (row, data, dataIndex) {
                    if (data.flag === "Holiday" || data.flag === "Weekend") {
                        $(row).css("background-color", "#fe6675");
                        $(row).css("font-weight", "bold");
                        $(row).find(".fa-edit").hide();
                    }
                },
            });

        },
    });
}




