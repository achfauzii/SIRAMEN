$(document).ready(function () {
    //    

    /*const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;*/
    $('#dataTableAccounts').DataTable({
        "ajax": {
            url: "http://202.69.99.67:9001/api/Employees/EmployeeAdmin",
            type: "GET",
            "datatype": "json",
            "dataSrc": "data",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("Token")
            },
        },
        "columns": [
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1 + ".";
                }
            },
            { "data": "fullname" },
            { "data": "email" },
            { "data": "gender" },
            { "data": "hiredstatus" },
            {
                "data": null,
                "render": function (data, type, row) {
                    var roleId = row.roleId;

                    if (roleId == "3") {
                        role = '<button class="badge badge-pill badge-primary" data - placement="right" data - toggle="modal" data - animation="false" style="outline: none; border: none;" title="Edit" onclick="return GetById(\'' + row.accountId + '\')">Employee</button>'

                    } else {
                        role = '<button class="badge badge-pill badge-warning" data - placement="right" data - toggle="modal" data - animation="false" style="outline: none; border: none;" title="Edit" onclick="return GetById(\'' + row.accountId + '\')">Admin</button>'
                    }


                    return role;
                }
            }
        ],
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            api.column(1, { page: 'current' }).data().each(function (group, i) {
                $(rows).eq(i).find('td:first').html(i + 1);
            });
        }
    })

});

function GetById(accountId) {

    /*const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;*/
    $.ajax({
        url: "http://202.69.99.67:9001/api/Accounts/AccountId?accountId=" + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {

            var obj = result.data; //data yg kita dapat dr API  
            $('#AccountId').val(obj.accountId);
            $('#Role').val(obj.roleId);
            //document.getElementById('fullname').text(obj.fullname);
            console.log(obj.fullname);
            //document.getElementById('fullName').text = obj.fullname;
            $('#FullName').text(obj.fullname);
            $('#Modal').modal('show');
            $('#Update').show();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function UpdateRole() {

    var Account = new Object();
    Account.accountId = $('#AccountId').val();
    Account.roleId = $('#Role').val();
    /*const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Account.accountId = accid;*/
    $.ajax({
        url: 'http://202.69.99.67:9001/api/Accounts/UpdateRole',
        type: 'PUT',
        data: JSON.stringify(Account),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },

    }).then((result) => {

        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been update!',
                showConfirmButton: false,
                timer: 1500
            })
            $('#Modal').modal('hide');
            $('#dataTableAccounts').DataTable().ajax.reload();
        }
        else {
            Swal.fire(
                'Error!',
                result.message,
                'error'
            )
            $('#dataTableAccounts').DataTable().ajax.reload();
        }
    });
}