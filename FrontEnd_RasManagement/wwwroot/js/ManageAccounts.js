$(document).ready(function () {
    //debugger;    

    /*const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;*/
    $('#dataTableAccounts').DataTable({
        "ajax": {
            url: "https://rasmanagement-001-site1.atempurl.com/api/Employees/EmployeeAdmin",
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
                    return meta.row + 1;
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
        ]
    })

});

function GetById(accountId) {
    debugger;
    /*const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;*/
    $.ajax({
        url: "https://rasmanagement-001-site1.atempurl.com/api/Accounts/AccountId?accountId=" + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            debugger;
            var obj = result.data; //data yg kita dapat dr API  
            $('#AccountId').val(obj.accountId);
            $('#Role').val(obj.roleId);
            
            $('#Fullname').text(obj.fullname);
            $('#Modal').modal('show');
            $('#Update').show();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function UpdateRole() {
    debugger;
    var Account = new Object();
    Account.accountId = $('#AccountId').val();
    Account.roleId = $('#Role').val();
    /*const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Account.accountId = accid;*/
    $.ajax({
        url: 'https://rasmanagement-001-site1.atempurl.com/api/Accounts/UpdateRole',
        type: 'PUT',
        data: JSON.stringify(Account),
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