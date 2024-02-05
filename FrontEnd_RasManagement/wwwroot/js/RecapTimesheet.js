﻿// A $( document ).ready() block.
var table;
$(document).ready(function () {
    $.ajax({
        url: "https://localhost:7177/api/EmployeePlacements", // Replace with your API endpoint
        method: "GET",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (data) {
            // Create a Set to store unique company names
            var placement = data.data;
            var uniqueCompanyNames = new Set();

            // Iterate over the data and add unique company names to the Set
            for (var i = 0; i < placement.length; i++) {
                uniqueCompanyNames.add(placement[i].companyName);
            }

            // Create <option> elements based on unique company names and append them to the select
            uniqueCompanyNames.forEach(function (companyName) {
                var option = $("<option>")
                    .val(companyName)  // Set the value attribute
                    .text(companyName);
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

});
   
   


function submitReportTimesheet() {
    table.destroy();
    var companyName = $('#companySelect').val();
    var month = $('#month').val();
  
    var report = $('#reportTimesheet');

    // Check if companyName or month is empty or null
    if (!companyName || !month) {
        // Show the warning alert
        $('#nullInput').removeAttr('hidden');

        // Hide the DataTable and clear it
        $('#reportTimesheetTable').DataTable().clear().destroy();
        report.hide();
        return;
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