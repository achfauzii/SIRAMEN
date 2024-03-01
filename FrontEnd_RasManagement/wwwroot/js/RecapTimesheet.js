// A $( document ).ready() block.
var table;
$(document).ready(function () {
    $.ajax({
        url: "https://localhost:7177/api/ClientName", // Replace with your API endpoint
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
                $("#companySelect").append(option).select2();
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

});
   
   


function submitReportTimesheet() {

    var companyName = $('#companySelect').val();
    var month = $('#month').val();
    $("#nullInput").hide();
    var report = $('#reportTimesheet');
    console.log(companyName);
    console.log(month);
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
  
       ],
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

       
      
    });


}
