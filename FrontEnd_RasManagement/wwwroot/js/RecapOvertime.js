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

    // Update the download button's href attribute with the new URL
    $("#btn-report").attr("href", downloadUrl);

    // Show the download button
    $("#btn-report").show();

    if ($.fn.DataTable.isDataTable('#reportTimesheetTable')) {
        $('#reportTimesheetTable').DataTable().destroy();
    }

    var table = new $('#reportTimesheetTable').DataTable({
        ajax: {
            url: 'https://localhost:7177/api/TimeSheet/GetTimeSheetByCompanyNameAndMonth?companyName=' + companyName + '&month=' + month,
            type: "GET",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            dataSrc: function (json) {
                // Populate the accountName filter dropdown with unique names
                var accountNameFilter = document.getElementById("accountNameFilter");
                console.log(accountNameFilter);
                var uniqueNames = [...new Set(json.data.map(item => item.accountName))];
                accountNameFilter.innerHTML = '<option value="">Select Account Name</option>'; // Reset options
                uniqueNames.forEach(function (name) {
                    var option = document.createElement("option");
                    option.value = name;
                    option.textContent = name;
                    accountNameFilter.appendChild(option);
                });
                return json.data;
            }
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
                orderable: false, // Disable ordering
                width: "7%",
                render: function (data, type, row) {
                    return (
                        '<div class="d-flex flex-row">' +
                        '<a href="#" class="ml-1 pt-0 text-primary" data-toggle="tooltip" style="font-size: 14pt" data-placement="left" data-tooltip="tooltip" title="Detail" onclick = "detailRecap(\'' +
                        row.accountId + '\', \'' + month + '\', \'' + row.accountName +
                        '\')"><i class="fas fa-info-circle"></i></a>' +
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
        // Ensure row numbering does not change
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: "current" }).nodes();
            var currentPage = api.page.info().page; // Get current page number
            var startNumber = currentPage * api.page.info().length + 1; // Calculate start row number on current page

            api.column(0, { page: "current" })
                .nodes()
                .each(function (cell, i) {
                    cell.innerHTML = startNumber + i; // Update row number on each page
                });
        },
        initComplete: function (settings, json) {
            // Check if the table has data
            if (table.data().count() === 0) {
                // Hide the button if no data
                $("#btn-report").hide();
            } else {
                // Show the button if there is data
                $("#btn-report").show();
            }
        }
    });

    // Event listener for the account name filter dropdown
    $('#accountNameFilter').on('change', function () {
        var selectedName = this.value;
        table.column(1).search(selectedName).draw();
    });
}





function detailRecap(accountId, month, name) {
    debugger;
    $("#informationAccountModal").modal("show");
    document.getElementById('namaPegawai').textContent = name;

    if (name) {
        name.textContent = name;
        console.log("Name element found and set:", name); // Debugging line
    } else {
        console.error("Name element not found"); // Debugging line
    }

    document.getElementById("tableTimeSheet").hidden = false;
    if ($.fn.DataTable.isDataTable("#timeSheetTable")) {
        $("#timeSheetTable").DataTable().destroy();
    }
    
    $.ajax({
        url: "https://localhost:7177/api/TimeSheet/TimeSheetByAccountIdAndMonth?accountId=" +
            accountId + "&month=" + month,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (response) {
            var data = response.data;
            console.log(data);

            // Filter data to only include rows where flag contains "Overtime"
            var filteredData = data.filter(function (item) {
                return item.flag.includes("Overtime");
            });

            // Initialize DataTable with filtered data
            table = $("#timeSheetTable").DataTable({
                data: filteredData,
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
                // Background color for rows with flag "Holiday" or "Weekend"
                createdRow: function (row, data, dataIndex) {
                    if (data.flag === "Holiday" || data.flag === "Weekend") {
                        $(row).css("background-color", "#fe6675");
                        $(row).css("font-weight", "bold");
                        $(row).find(".fa-edit").hide();
                    }
                },
            });
        },
        error: function (error) {
            console.error("Error fetching data from API:", error);
        }
    });

};





