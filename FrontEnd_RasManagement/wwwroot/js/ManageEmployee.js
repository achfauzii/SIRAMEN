$(document).ready(function () {

    $('#dataTableEmployee thead tr').clone(true).addClass('filters').attr('id', 'filterRow').appendTo('#dataTableEmployee thead');

   // $('#loader').show();


    var table= $('#dataTableEmployee').on('processing.dt', function (e, settings, processing) {
        $('#loader').css('display', processing ? 'block' : 'none');
    }).DataTable({

        paging: true,
        scrollX: true,
        orderCellsTop: true,
        fixedHeader: true,


        "ajax": {
            url: "https://localhost:7177/api/Employees",
            type: "GET",
            "datatype": "json",
            async: true,
            "dataSrc": "data",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("Token")
            },



        },


        initComplete: function () {
            var api = this.api();
            // For each column
            api.columns().eq(0).each(function (colIdx) {
                // Set the header cell to contain the input element
                var cell = $('.filters th').eq($(api.column(colIdx).header()).index());
                var title = $(cell).text();
                // Check if the column is "No", "Gender", or "Placement Status"
                if (title !== "No" && title !== "Gender" && title !== "Placement Status" && title !== "Action") {
                    $(cell).html('<input type="text" class = "form-control form-control-sm pt-0 pb-0" placeholder="'+ title +'" />');
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
            {
                "render": function (data, type, row) {
                    var accountId = row.accountId;
                    var placementStatus = "Idle"; // Default value jika data tidak ditemukan

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
                                var result = placementData.data[0]; // Ambil data yang pertama dari array data
                                placementStatus = result.placementStatus;
                            }
                        }, error: function () {
                           
                        }
                    });
                    if (placementStatus == "Idle") {
                        placementStatus = '<span class="badge badge-pill badge-warning">Idle</span>'
                    } else {
                        placementStatus = '<span class="badge badge-pill badge-success">' + placementStatus + '</span>'
                    }


                    return placementStatus
                }
            },

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
                                var result = placementData.data[0]; // Ambil data yang pertama dari array data

                                if (result.placementStatus == "Idle") {
                                    placementLocation = "";
                                } else {
                                    placementLocation = result.companyName;
                                }

                            } else {
                             
                                placementLocation ="";
                            }
                          

                        }, error: function () {

                        }
                    });

                 
                    return placementLocation
                }
            },
            { "data": "hiredstatus" },
            {
                "data": null,
                orderable: false, // menonaktifkan order
                "render": function (data, type, row) {

                    return '<div class="text-center row">' +
                        '<a href="#" class="text-dark ml-2 pt-0" data-toggle="tooltip" data-placement="top" title="Curiculum Vitae" onclick = "GenerateCv(\'' + row.accountId + '\')"><i class="far fa-file-pdf"  ></i></a>' +

                        '</div>' +

                        '<div class="text-center row">' +
                        '<a href="#" class="btn  ml-2 btn-sm p-0 text-light"  style="background-color:#624DE3;" data-bs-toggle="modal" onclick = "return Detail(\'' + row.accountId + '\')">Detail</a>' +
                        '</div>';
                }
            }

        ],
        //"order": [], // menonaktifkan order pada semua kolom
        /*   "fnDrawCallback": function (oSettings) {
                 // mengatur nomor urut berdasarkan halaman dan pengurutan yang aktif, menetapkan nomor urut menjadi 1
                 var table = $('#TB_Department').DataTable();
                 var startIndex = table.context[0]._iDisplayStart;
                 table.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
                     cell.innerHTML = startIndex + i + 1;
                 });
             }*/

        /*   "fndrawCallback": function (settings) {
               var api = this.api();
               var rows = api.rows({ page: 'current' }).nodes();
               api.column(1, { page: 'current' }).data().each(function (group, i) {
   
                   $(rows).eq(i).find('td:first').html(i + 1);
               });s
           }*/


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

function Detail(id) {


    window.location.href = '/ManageEmployee/DetailEmployee?accountId=' + id;



}

/*function GetById(accountId) {
    const startDate = document.getElementById("showStartDate");
    const endDate = document.getElementById("showEndDate");
    startDate.style.display = "none";
    endDate.style.display = "block";
    var accountId = accountId;
    $.ajax({
        type: 'GET',
        url: 'https://localhost:7177/api/EmployeePlacements/accountId?accountId=' + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        $('#modal-add').modal('hide');
        $('#modal-add').on('hidden.bs.modal', function () {
            $(this).data('bs.modal', null);
        });
       
        var obj = result.data; //data yg didapat dari api

        // Konversi string tanggal menjadi objek Date
        var startDate = new Date(obj.startDate);
        var endDate = new Date(obj.endDate);

        // Fungsi untuk memformat tanggal menjadi "yyyy-MM-dd" (format yang diharapkan input date)
        function formatDate(date) {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1).toString().padStart(2, '0');
            var day = date.getDate().toString().padStart(2, '0');
            return year + "-" + month + "-" + day;
        }

        $('#companyName').val(obj.companyName);
        $('#jobRole').val(obj.jobRole);
        $('#startDate').val(formatDate(startDate));
        $('#endDate').val(formatDate(endDate));
        $('#description').val(obj.description);
        $('input[name="status"][value="' + obj.placementStatus + '"]').prop('checked', true);
        $('#Update').show();
        $('#Add').hide();



    })
}
*/

function ClearScreenPlacement() {
    const startDate = document.getElementById("showStartDate");
    $('#companyName').val('');
    $('#jobRole').val('');
    $('#startDate').val('');
    $('#endDate').val('');
    $('#description').val('');
    $('#placementStatus').val('');
    $('#Update').hide();
    $('#Add').show();
    startDate.style.display = "block";
    $('input[required]').each(function () {
        var input = $(this);

        input.next('.error-message').hide();

    });


}

function Save(accountId) {

    var isValid = true;

    $('input[required]').each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next('.error-message').show();
            isValid = false;
        } else {
            input.next('.error-message').hide();
        }
    });

    if (!isValid) {
        return;
    }
    var placement = new Object  //object baru
    placement.companyName = $('#companyName_').val();
    placement.jobRole = $('#jobRole').val();
    placement.startDate = $('#startDate').val();
  
    placement.description = $('#description').val();//value insert dari id pada input

    placement.placementStatus = $('input[name="status"]:checked').val();
    placement.accountId = accountId;
    

    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/EmployeePlacements',
        data: JSON.stringify(placement),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        $('#modalPlacement').modal('hide');
        //debugger;
        if (result.status == result.status == 201 || result.status == 204 || result.status == 200) {
            //$('#modal-add').modal('hide'); // hanya hide modal tetapi tidak menutup DOM nya
            Swal.fire({
                title: "Success!",
                text: "Data Berhasil Dimasukkan",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                
                location.reload();
               
            });
        }
        else {
            alert("Data gagal dimasukkan");
        }

    })
}

function Update() {
    debugger;
    var placement = new Object();
    placement.placementStatusId = $('#placementStatusId').val();
    placement.companyName = $('#companyName_').val();
    placement.jobRole = $('#jobRole').val();
    placement.startDate = $('#startDate').val();
    
    placement.endDate = $('#endDate').val();
    if (placement.endDate == '') {
        placement.endDate = null;
    }
    placement.description = $('#description').val();//value insert dari id pada input
    placement.placementStatus = $('input[name="status"]:checked').val();
    placement.accountId = $('#accountId').val();;
    console.log(placement)
    $.ajax({
        url: 'https://localhost:7177/api/EmployeePlacements',
        type: 'PUT',
        data: JSON.stringify(placement),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        $('#modalPlacement').modal('hide');
        if (result.status == 200) {
            Swal.fire({
                title: "Success!",
                text: "Data Berhasil Di Update",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                
                location.reload();
            });
        } else {
            alert("Data gagal Diperbaharui");
            location.reload();
        }
    });
}

function GenerateCv(accountId) {

    window.location.href = '/GenerateCv/Index?accountId=' + accountId;
}