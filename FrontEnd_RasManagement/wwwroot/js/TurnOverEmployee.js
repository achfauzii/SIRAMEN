$(document).ready(function () {
    debugger;

    $('#dataTableEmployee thead tr').clone(true).addClass('filters').attr('id', 'filterRow').appendTo('#dataTableEmployee thead');

    // $('#loader').show();


    var table = $('#dataTableEmployee').on('processing.dt', function (e, settings, processing) {
        $('#loader').css('display', processing ? 'block' : 'none');
    }).DataTable({

        paging: true,
        scrollX: true,
        orderCellsTop: true,
        fixedHeader: true,

        "ajax": {
            url: "https://localhost:7177/api/Employees/TurnOff",
            type: "GET",
            "datatype": "json",
            async: true,
            "dataSrc": "data",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("Token")
            },

            /*success: function (placementData) {
                
                var filteredData = placementData.data.filter(function (item) {
                    return item.placementStatus === "Blacklist";
                });

                *//*var table = $('#dataTableEmployee').DataTable({
                // konfigurasi DataTables lainnya
                data: filteredData,
                // ...
            });*//*

        }*/
        },

        initComplete: function () {
            var api = this.api();
            // For each column
            api.columns().eq(0).each(function (colIdx) {
                // Set the header cell to contain the input element
                var cell = $('.filters th').eq($(api.column(colIdx).header()).index());
                var title = $(cell).text();
                // Check if the column is "No", "Gender", or "Placement Status"
                if (title !== "No" && title !== "Action") {
                    /*if (title === "Placement Status") { // Kolom placement status
                        $(cell).html('<select class="form-control form-control-sm"><option value="">All</option><option value="Blacklist">Blacklist</option></select>');
                    } else {
                        $(cell).html('<input type="text" class="form-control form-control-sm pt-0 pb-0" placeholder="' + title + '" />');
                    }*/
                    $(cell).html('<input type="text" class = "form-control form-control-sm pt-0 pb-0" placeholder="' + title + '" />');
                    // On every keypress in this input
                    $('input', $('.filters th').eq($(api.column(colIdx).header()).index()))
                        .off('keyup change')
                        .on('keyup change', function (e) {
                            e.stopPropagation();
                            // Get the search value
                            $(this).attr('title', $(this).val());
                            var regexr = '({search})'; //$(this).parents('th').find('select').val();
                            var cursorPosition = this.selectionStart;
                            // Search the column for that value
                            api
                                .column(colIdx)
                                .search((this.value != "") ? regexr.replace('{search}', '(((' + this.value + ')))') : "", this.value != "", this.value == "")
                                .draw();
                            $(this).focus()[0].setSelectionRange(cursorPosition, cursorPosition);
                        });
                } else {
                    // For columns "No", "Gender", and "Placement Status", leave the header cell empty
                    var cell = $('.filters th').eq($(api.column(colIdx).header()).index());
                    $(cell).html('');
                }


            });
        },
        "columns": [
            //Render digunakan untuk menampilkan atau memodifikasi isi sel (cell) pada kolom

            {
                // orderable: false, // menonaktifkan order hanya pada kolom tertentu
                "data": null,
                "width": "4%",
                "render": function (data, type, row, meta) {
                    return meta.row + 1 + ".";
                }
            },

            { "data": "fullname", },
            { "data": "email" },
            { "data": "gender" },
            { "data": "address" },
            {
                "render": function (data, type, row) {
                    var accountId = row.accountId;


                    // Lakukan permintaan AJAX untuk mendapatkan data placement berdasarkan accountId
                    $.ajax({
                        url: "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" + accountId,
                        type: "GET",
                        datatype: "json",
                        async: false, // Set async menjadi false agar tindakan ini menunggu respons dari permintaan AJAX sebelum melanjutkan
                        headers: {
                            "Authorization": "Bearer " + sessionStorage.getItem("Token")
                        },
                        success: function (placementData) {
                            if (placementData.data && placementData.data.length > 0) {
                                var result = placementData.data[0];
                                if (result.placementStatus === "Blacklist") {
                                    placementStatus = result.placementStatus;
                                } else {
                                    placementStatus = result.placementStatus;
                                }
                            }
                        },
                        error: function () {
                            // Tangani error jika diperlukan
                        }
                    });
                    if (placementStatus === "Blacklist") {
                        return '<span type="button" class="badge badge-pill badge-danger"  data-toggle="modal" data-target="#infoTurnOver" onclick=" return showDescription(\'' + row.accountId + '\')">' + placementStatus + '</span>';
                    } else if (placementStatus === "Resign") {
                        return '<span type="button" class="badge badge-pill badge-dark" data-toggle="modal" data-target="#infoTurnOver" onclick=" return showDescription(\'' + row.accountId + '\')">' + placementStatus + '</span>';
                    } else {
                        return '<span type="button" class="badge badge-pill badge-primary"  data-toggle="modal" data-target="#infoTurnOver" onclick=" return showDescription(\'' + row.accountId + '\')" >' + placementStatus + '</span>';
                    }


                    return placementStatus
                }
            },


            { "data": "hiredstatus" }

        ],
        //Agar nomor tidak berubah
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            api.column(1, { page: 'current' }).data().each(function (group, i) {
                $(rows).eq(i).find('td:first').html(i + 1);
            });
        }


    });



    $("#resetFilters").on("click", function () {
        // Reset input pencarian dan filter DataTable
        $("#searchInput").val("");
        table.search("").columns().search("").draw();

        // Hapus elemen baris filter dari DOM
        $(".filters input").val("").keyup().change();

        // Lakukan reload data
        table.ajax.reload();

    });


});

function showDescription(accountId) {
    debugger;
    $.ajax({
        url: "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (placementData) {
            if (placementData.data && placementData.data.length > 0) {
            
                var result = placementData.data[0];
             
                if (result.description === "") {
                    var desc ="No Description."
                    $("#showInfo").text(desc);
                } else {
                    $("#showInfo").text(result.description);
                }
            }
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}