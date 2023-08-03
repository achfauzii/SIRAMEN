
var table = null;
$(document).ready(function () {
    //debugger;
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    table = $('#TB_Certificate').DataTable({
        "ajax": {
            url: "https://localhost:7177/api/Certificate/accountId?accountId=" + accid,
            type: "GET",
            "datatype": "json",
            "dataSrc": "data",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("Token")
            },
            /*success: function (result) {
                console.log(result)
            }*/
        },

        "columns": [
            {
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1 + "."
                }
            },
            { "data": "name" },
            { "data": "publisher" },
            {
                "data": "publicationYear",
                "render": function (data) {
                    // Pastikan data tidak null atau undefined sebelum melakukan format tanggal
                    if (data) {
                        const date = new Date(data);
                        const options = { month: 'long', year: 'numeric' };
                        return date.toLocaleDateString('en-EN', options);
                    } else {
                        return ""; // Jika data null atau undefined, tampilkan string kosong
                    }
                }
            },
            {
                "data": "validUntil",
                "render": function (data) {
                    // Pastikan data tidak null atau undefined sebelum melakukan format tanggal
                    if (data) {
                        const date = new Date(data);
                        const options = {  month: 'long', year: 'numeric' };
                        return date.toLocaleDateString('en-EN', options);
                    } else {
                        return ""; // Jika data null atau undefined, tampilkan string kosong
                    }
                }
            },
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                "data": null,
                "render": function (data, type, row) {
                    var modalId = "modal-edit-" + data.certificateId;
                    var deleteId = "modal-delete-" + data.certificateId;
                    return '<button class="btn btn-warning " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' + row.certificateId + ')"><i class="fa fa-edit"></i></button >' + '&nbsp;' +
                        '<button class="btn btn-danger" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(' + row.certificateId + ')"><i class="fa fa-trash"></i></button >'
                }
            }
        ],

        "order": [[1, "asc"]],
        //"responsive": true,
        //Buat ngilangin order kolom No dan Action
        "columnDefs": [
            {
                "targets": [0, 2, 3, 4, 5],
                "orderable": false
            }
        ],
        //Agar nomor tidak berubah
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            api.column(1, { page: 'current' }).data().each(function (group, i) {
                $(rows).eq(i).find('td:first').html(i + 1);
            });
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

function ClearScreen() {
    $('#CertificateId').val('');
    $('#Name').val('');
    $('#Publisher').val('');
    $('#PublicationYear').val('');
    $('#ValidUntil').val('');
    $('#Update').hide();
    $('#Save').show();
    $('input[required]').each(function () {
        var input = $(this);

        input.next('.error-message').hide();

    });
}

function GetById(CertificateId) {
    //debugger;
    $.ajax({
        url: "https://localhost:7177/api/Certificate/" + CertificateId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            //debugger;
            var obj = result.data; //data yg dapet dr id
            $('#CertificateId').val(obj.certificateId); //ngambil data dr api
            $('#Name').val(obj.name);
            $('#Publisher').val(obj.publisher);
            $('#PublicationYear').val(obj.publicationYear);
            $('#ValidUntil').val(obj.validUntil);
            $('#Modal').modal('show');
            $('#Save').hide();
            $('#Update').show();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function Save() {
    //debugger;
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

    var Certificate = new Object(); //bikin objek baru
    Certificate.name = $('#Name').val(); //value dari database\
    Certificate.publisher = $('#Publisher').val();  
    Certificate.publicationYear = $('#PublicationYear').val();
    Certificate.validUntil = $('#ValidUntil').val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Certificate.accountId = accid;
    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/Certificate',
        data: JSON.stringify(Certificate), //ngirim data ke api
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
                title: 'Berhasil',
                text: 'Data berhasil dimasukkan',
                showConfirmButton: false,
                timer: 1500
            })
            $('#Modal').modal('hide');
            table.ajax.reload();
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Data Gagal dimasukkan!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#Modal').modal('hide');
            table.ajax.reload();
        }
    })
}

function Delete(CertificateId) {
    debugger;
    Swal.fire({
        title: 'Kamu yakin?',
        text: "Anda tidak akan bisa mengembalikannya jika memilih Ya!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "https://localhost:7177/api/Certificate/" + CertificateId,
                type: "DELETE",
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("Token")
                },
            }).then((result) => {
                debugger;
                if (result.status == 200) {
                    Swal.fire(
                        'Berhasil',
                        'Data sudah dihapus.',
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

function Update() {
    debugger;
    var Certificate = new Object();
    Certificate.certificateId = $('#CertificateId').val();
    Certificate.name = $('#Name').val();
    Certificate.publisher = $('#Publisher').val();
    Certificate.publicationYear = $('#PublicationYear').val();
    Certificate.validUntil = $('#ValidUntil').val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Certificate.accountId = accid;
    $.ajax({
        url: 'https://localhost:7177/api/Certificate',
        type: 'PUT',
        data: JSON.stringify(Certificate),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },

    }).then((result) => {
        debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data berhasil diupdate',
                showConfirmButton: false,
                timer: 1500
            })
            $('#Modal').modal('hide');
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