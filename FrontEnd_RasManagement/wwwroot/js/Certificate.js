var table = null;
$(document).ready(function () {
    debugger;
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    table = $('#TB_Certificate').DataTable({
        "ajax": {
            url: "https://localhost:7177/api/Certificate/accountId?accountId=" + accid,
            type: "GET",
            "datatype": "json",
            "dataSrc": "data"
        },
        "columns": [
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { "data": "name" },
            { "data": "publisher" },
            { "data": "publicationYears" },
            { "data": "validUntil" },
            {
                "data": null,
                "render": function (data, type, row) {
                    return '<button class="btn btn-warning " data-placement="left" data-toggle="tooltip" data-animation="false" title="Edit" onclick="return getbyID(' + row.certificateId + ')"><i class="fa fa-pen"></i></button >' + '&nbsp;' +
                        '<button class="btn btn-danger" data-placement="right" data-toggle="tooltip" data-animation="false" title="Delete"  onclick="return Delete(' + row.certificateId + ')"><i class="fa fa-trash"></i></button >'
                }
            }
        ]
    })

})

function ClearScreen() {
    $('#CertificateId').val('');
    $('#Name').val('');
    $('#Publisher').val('');
    $('#PublicationYears').val('');
    $('#ValidUntil').val('');
    $('#Update').hide();
    $('#Save').show();
}

function getbyID(CertificateId) {
    //debugger;
    $.ajax({
        url: "https://localhost:7177/api/Certificate/" + CertificateId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            //debugger;
            var obj = result.data; //data yg dapet dr id
            $('#CertificateId').val(obj.certificateId); //ngambil data dr api
            $('#Name').val(obj.name);
            $('#Publisher').val(obj.organizer);
            $('#PublicationYears').val(obj.years);
            $('#ValidUntil').val(obj.description);
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
    var Certificate = new Object(); //bikin objek baru
    Certificate.Name = $('#Name').val(); //value dari database
    Certificate.Publisher = $('#Publisher').val();
    Certificate.PublicationYears = $('#PublicationYears').val();
    Certificate.ValidUntil = $('#ValidUntil').val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Certificate.AccountId = accid;
    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/Certificate',
        data: JSON.stringify(Certificate), //ngirim data ke api
        contentType: "application/json; charset=utf-8"
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
            table.ajax.reload();
        }
        else {
            Swal.fire(
                'Error!',
                result.message,
                'error'
            )
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
    Certificate.CertificateId = $('#CertificateId').val();
    Certificate.Name = $('#Name').val();
    Certificate.Organizer = $('#Organizer').val();
    Certificate.Years = $('#Years').val();
    Certificate.Description = $('#Description').val();
    $.ajax({
        url: 'https://localhost:7177/api/Certificate',
        type: 'PUT',
        data: JSON.stringify(Certificate),
        contentType: "application/json; charset=utf-8",

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