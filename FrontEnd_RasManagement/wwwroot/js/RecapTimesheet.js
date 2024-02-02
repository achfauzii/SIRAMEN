// A $( document ).ready() block.
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

    var table = new $('#reportTimesheetTable').DataTable({
        ajax: {
            url: 'https://localhost:7177/api/TimeSheet/GetTimeSheetByCompanyNameAndMonth?companyName=' + companyName + '&month=' + month,
            type: "GET",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
        },
    
        columnDefs: [
            {
                searchable: false,
                orderable: false,
                targets: 0
            }
        ],
        columns: [
            { data: 'timeSheetId' },
            { data: 'account.accountName' },
     
            // Add more columns as needed based on your data structure
        ],

       
      
    });


    table
        .on('order.dt search.dt', function () {
            let i = 1;

            table
                .cells(null, 0, { search: 'applied', order: 'applied' })
                .every(function (cell) {
                    this.data(i++);
                });
        })
        .draw();

    // Hide the warning alert if inputs are valid
    $('#nullInput').hide();
    // Show the DataTable and card
    report.show();
}
