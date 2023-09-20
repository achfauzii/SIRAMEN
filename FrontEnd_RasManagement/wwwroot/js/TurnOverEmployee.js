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
            url: "https://localhost:7177/api/TurnOver/TurnOverEmployee",
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


                    var placementStatus = row.status;


                    /*console.log(row.placements.placementStatus);
                    var placementStatus = row.placements.placementStatus;*/
                    if (placementStatus === "Blacklist") {
                        return '<span type="button" class="badge badge-pill badge-danger"  data-toggle="modal" data-target="#infoTurnOver" onclick=" return showDescription(\'' + row.deptName + '\', \'' + row.description + '\', \'' + row.exitDate + '\')">' + placementStatus + '</span>';
                    } else if (placementStatus === "Resign") {
                        return '<span type="button" class="badge badge-pill badge-dark" data-toggle="modal" data-target="#infoTurnOver" onclick=" return showDescription(\'' + row.deptName + '\', \'' + row.description + '\', \'' + row.exitDate + '\')">' + placementStatus + '</span>';
                    } else {
                        return '<span type="button" class="badge badge-pill badge-primary"  data-toggle="modal" data-target="#infoTurnOver" onclick=" return showDescription(\'' + row.deptName + '\', \'' + row.description + '\', \'' + row.exitDate + '\')">' + placementStatus + '</span>';
                    }


                    return placementStatus
                }
            },





        ],



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

function showDescription(namaDept, description, date) {
 
    const showDept = document.getElementById("showDept");
    // Buat objek Date dari string tanggal awal
    var dateFormat = new Date(date);

    // Buat opsi untuk pemformatan tanggal yang diinginkan
    var formatOpt = { year: 'numeric', month: 'long', day: 'numeric' };

    // Gunakan fungsi toLocaleDateString() dengan opsi pemformatan
    var newDate = dateFormat.toLocaleDateString('id-ID', formatOpt);
    if (namaDept === "null") {
        showDept.style.display = 'none';
       
    } else {
       showDept.style.display = 'block';
        $("#namaDept").text(namaDept);
    }


    if (description === "") {
        var description = "No Description."
        $("#description").text(desc);
    } else {
        $("#description").text(description);
    }
    $("#date").text(newDate);
    

}