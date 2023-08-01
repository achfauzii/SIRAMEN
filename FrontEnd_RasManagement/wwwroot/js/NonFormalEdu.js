$(document).ready(function () {
    //debugger;    
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    $('#NonFormalEdu').DataTable({
        "ajax": {
            url: "https://localhost:7177/api/NonFormalEdu/accountId?accountId=" + accid,
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
            { "data": "organizer" },
            { "data": "years" },
            { "data": "description" },
            {
                "data": null,
                "render": function (data, type, row) {
                    return '<button class="btn btn-warning " data-placement="left" data-toggle="tooltip" data-animation="false" title="Edit" onclick="return getbyID(' + row.nonFormalId + ')"><i class="fa fa-pen" ></i></button >' + '&nbsp;' +
                        '<button class="btn btn-danger" data-placement="right" data-toggle="tooltip" data-animation="false" title="Delete" onclick="return Delete(' + row.nonFormalId + ')"><i class="fa fa-trash"></i></button >'
                }
            }
        ]
    })

})

function parseJwt(token) {
    //debugger;
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function ClearScreen() {
    debugger;
    $('#Name').val('');
    $('#Organizer').val('');
    $('#Years').val('');
    $('#Description').val('');
    $('#UpdateNonFormal').hide();
    $('#SaveNonFormal').show();
}

function getbyID(NonFormalId) {
    //debugger;
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    $.ajax({
        url: "https://localhost:7177/api/NonFormalEdu/" + NonFormalId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            //debugger;
            var obj = result.data; //data yg dapet dr id
            $('#NonformalId').val(obj.nonFormalId); //ngambil data dr api
            $('#Name').val(obj.name);
            $('#Organizer').val(obj.organizer);
            $('#Years').val(obj.years);
            $('#Description').val(obj.description);
            $('#AccountId').accid;
            $('#ModalNonFormal').modal('show');
            $('#SaveNonFormal').hide();
            $('#UpdateNonFormal').show();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function Save() {
    var NonFormal = new Object(); //bikin objek baru
    NonFormal.Name = $('#Name').val(); //value dari database
    NonFormal.Organizer = $('#Organizer').val();
    NonFormal.Years = $('#Years').val();
    NonFormal.Description = $('#Description').val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    NonFormal.AccountId = accid;
    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/NonFormalEdu',
        data: JSON.stringify(NonFormal), //ngirim data ke api
        contentType: "application/json; charset=utf-8"
    }).then((result) => {
        //debugger;
        if (result.status == result.status == 201 || result.status == 204 || result.status == 200) {
            //alert("Data Berhasil Dimasukkan");
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data berhasil dimasukkan',
                showConfirmButton: false,
                timer: 1500
            })
            $('#NonFormalEdu').DataTable().ajax.reload();
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

function Delete(NonFormalId) {
    //debugger;
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
                url: "https://localhost:7177/api/NonFormalEdu/" + NonFormalId,
                type: "DELETE",
                dataType: "json",
            }).then((result) => {
                //debugger;
                if (result.status == 200) {
                    Swal.fire(
                        'Berhasil',
                        'Data sudah dihapus.',
                        'success'
                    )
                    $('#NonFormalEdu').DataTable().ajax.reload();
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
    var NonFormal = new Object();
    NonFormal.NonFormalId = $('#NonformalId').val();
    NonFormal.Name = $('#Name').val();
    NonFormal.Organizer = $('#Organizer').val();
    NonFormal.Years = $('#Years').val();
    NonFormal.Description = $('#Description').val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    NonFormal.AccountId = accid;
    $.ajax({
        url: 'https://localhost:7177/api/NonFormalEdu',
        type: 'PUT',
        data: JSON.stringify(NonFormal),
        contentType: "application/json; charset=utf-8",
    }).then((result) => {
        debugger;
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

