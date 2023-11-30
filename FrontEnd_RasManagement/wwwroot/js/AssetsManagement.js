var table = null;
$(document).ready(function () {
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    table = $('#TB_Assets').DataTable({
        "ajax": {
            url: "https://localhost:7177/api/Assets/accountId?accountId=" + accid,
            type: "GET",
            "datatype": "json",
            "dataSrc": "data",

            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("Token")
            },
        },
        "searching": false,
        paging: false,
        info: false,
        "columns": [

            {
                "data": "nama",
                "render": function (data, type, row) {
                    // Menambahkan margin otomatis ke elemen dengan properti data bernilai "nama"
                    return '<div >' + data + '</div>';
                }
            },
            {
                "data": null,
                "render": function (data, type, row) {
                    var leftColumn =
                        "Processor: " + row.processor +
                        "<br>Display: " + row.display +
                        "<br>Operating System: " + row.operatingSystem +
                        "<br>RAM: " + row.ram;

                    var rightColumn =
                        "SSD: " + row.ssd +
                        "<br>HDD: " + row.hdd +
                        "<br>Graphic Card: " + row.graphicCard +
                        "<br>Charger: " + (row.charger ? "Yes" : "No");

                    return '<div class="row">' +
                        '<div class="col-5">' + leftColumn + '</div>' +
                        '<div class="col-5">' + rightColumn + '</div>' +
                        '</div>';
                }
            },


            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                "data": null,
                "render": function (data, type, row) {
                    var editButton = '<button class="btn btn-warning" data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' + row.assetsManagementId + ')"><i class="fa fa-edit"></i></button>';

                    var deleteButton = '<button class="btn btn-danger" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(' + row.assetsManagementId + ')"><i class="fa fa-trash"></i></button>';

                    return '<div class="d-flex">' + editButton + '&nbsp;' + deleteButton + '</div>';
                }
            }
        ],


        //"responsive": true,
        //Buat ngilangin order kolom No dan Action
        "columnDefs": [
            {
                "targets": [0, 1, 2],
                "orderable": false,
            }

        ],
        "order": [0],



        //Agar nomor tidak berubah
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();

            if (rows.length > 0) {
                $('#rfid_h6').text("RFID : " + settings.json.data[0].rfid);
                $('#rfid_h6').show();

                $('#add-asset').hide();  // Jika ada data, sembunyikan tombol
            } else {
                $('#rfid_h6').hide();
                $('#add-asset').show();  // Jika tidak ada data, tampilkan tombol
            }
        }
    })
})

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
function ClearScreenAsset() {
    $('#brand').val('');
    $('#RFID').val('');
    $('#Processor').val('');
    $('#Display').val('');
    $('#os').val('Windows');
    $('#ram').val('');
    $('#ssd').val('');
    $('#hdd').val('');
    $('#GraphicCard').val('');
    $('#charger').val('Yes');
    $('#Update').hide();
    $('#Save').show();
    $('input[required]').each(function () {
        var input = $(this);

        input.next('.error-message').hide();

    });
}
function SaveAsset() {
    debugger;
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

    var ramValue = $('#ram').val().replace(/^0+/, ''); // Menghapus 0 di awal
    var ssdValue = $('#ssd').val().replace(/^0+/, ''); //hapus 0 di awal
    var hddValue = $('#hdd').val().replace(/^0+/, ''); 
 
    if(ramValue === ""){
        $('#ram').next().show();
    }else{
        $('#ram').next().hide();
    }
    if (ssdValue === "" && hddValue === "" ) {
        $('#ssd-error').show();
       
        return;
    } else{
        $('#ssd-error').hide();
       
    }
    
    if (!isValid) {
        return;
    }
 
    var Assets = new Object(); //bikin objek baru
    Assets.rfid = $('#RFID').val();
    Assets.nama = $('#brand').val();
    Assets.processor = $('#Processor').val();
    Assets.display = $('#Display').val();
    Assets.operatingSystem = $('#os').val();
    Assets.ram = (ramValue !== "" ? ramValue + " GB" : "-");
    Assets.ssd = (ssdValue !== "" ? ssdValue + " GB" : "-");
    Assets.hdd = (hddValue !== "" ? hddValue + " GB" : "-");
    Assets.graphicCard = $('#GraphicCard').val();
    Assets.charger = ($('#charger').val() === 'Yes') ? true : false;
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Assets.accountId = accid;
    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/Assets',
        data: JSON.stringify(Assets), //ngirim data ke api
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        debugger;
        if (result.status == result.status == 201 || result.status == 204 || result.status == 200) {
            //alert("Data Berhasil Dimasukkan");
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been added!',
                showConfirmButton: false,
                timer: 1500
            })
            $('#ModalAssets').modal('hide');
            table.ajax.reload();
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Data Gagal dimasukkan!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#ModalAssets').modal('hide');
            table.ajax.reload();
        }
    })
}
function GetById(assetsManagementId) {
    console.log(assetsManagementId)
    debugger;
    $.ajax({
        url: "https://localhost:7177/api/Assets/" + assetsManagementId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            debugger;
            var obj = result.data; //data yg dapet dr id
            $('#assetsManagementId').val(obj.assetsManagementId); //ngambil data dr api
            $('#brand').val(obj.nama);
            $('#RFID').val(obj.rfid);
            $('#Processor').val(obj.processor);
            $('#Display').val(obj.display);
            $('#os').val(obj.operatingSystem);
            $('#ram').val(obj.ram ? obj.ram.replace(/\D/g, '') : "-");
            $('#ssd').val(obj.ssd ? obj.ssd.replace(/\D/g, '') : "-");
            $('#hdd').val(obj.hdd ? obj.hdd.replace(/\D/g, '') : "-");
            $('#GraphicCard').val(obj.graphicCard);
            var chargerElement = $('#charger');
            chargerElement.val(obj.charger ? 'Yes' : 'No');
            $('#ModalAssets').modal('show');
            $('#Save').hide();
            $('#Update').show();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function Delete(assetsManagementId) {
    debugger;
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "https://localhost:7177/api/Assets/" + assetsManagementId,
                type: "DELETE",
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("Token")
                },
            }).then((result) => {
                debugger;
                if (result.status == 200) {
                    Swal.fire(
                        'Deleted!',
                        'Your data has been deleted.',
                        'success'
                    )
                    table.ajax.reload();
                }
                else {
                    Swal.fire(
                        'Error!',
                        result.message,
                        'error'
                    )
                }
            });
        }
    })
}

function UpdateAsset() {
    debugger;
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

    var ramValue = $('#ram').val().replace(/^0+/, ''); // Menghapus 0 di awal
    var ssdValue = $('#ssd').val().replace(/^0+/, ''); //hapus 0 di awal
    var hddValue = $('#hdd').val().replace(/^0+/, ''); 
 
    if(ramValue === ""){
        $('#ram').next().show();
    }else{
        $('#ram').next().hide();
    }
    if (ssdValue === "" && hddValue === "" ) {
        $('#ssd-error').show();
       
        return;
    } else{
        $('#ssd-error').hide();
       
    }
    if (!isValid) {
        return;
    }
    var Assets = new Object();
    Assets.assetsManagementId = $('#assetsManagementId').val();
    Assets.rfid = $('#RFID').val();
    Assets.nama = $('#brand').val();
    Assets.processor = $('#Processor').val();
    Assets.display = $('#Display').val();
    Assets.operatingSystem = $('#os').val();
    Assets.ram = (ramValue !== "" ? ramValue + " GB" : "-");
    Assets.ssd = (ssdValue !== "" ? ssdValue + " GB" : "-");
    Assets.hdd = (hddValue !== "" ? hddValue + " GB" : "-");
    Assets.graphicCard = $('#GraphicCard').val();
    Assets.charger = ($('#charger').val() === 'Yes') ? true : false;
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Assets.accountId = accid;
    $.ajax({
        url: 'https://localhost:7177/api/Assets',
        type: 'PUT',
        data: JSON.stringify(Assets),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },

    }).then((result) => {
        debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been update!',
                showConfirmButton: false,
                timer: 1500
            })
            $('#ModalAssets').modal('hide');
            table.ajax.reload();
        }
        else {
            Swal.fire(
                'Error!',
                result.message,
                'error'
            )
            table.ajax.reload();
        }
    });
}