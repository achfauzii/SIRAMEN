
$(document).ready(function () {
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;

    $.ajax({
        url: "https://localhost:7177/api/Qualification/accountId?accountId=" + accid,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (response) {
            //debugger;
            if (response.status === 200) {
                displayQualification(response.data);
            } else {
                console.error('Error fetching data from API:', response.message);
            }
        },
        error: function (error) {
            console.error('Error fetching data from API:', error);
        }
    });
});


function displayQualification(data) {
    var frameworks = data.map(item => item.framework).filter(filterframework => filterframework != null).join(', ');
    $('#framework').text(frameworks);
    var programmingLanguages = data.map(item => item.programmingLanguage).filter(filterpl => filterpl != null).join(', ');
    $('#programming').text(programmingLanguages);
    var databases = data.map(item => item.database).filter(filterdb => filterdb != null).join(', ');
    $('#databases').text(databases);
    var tools = data.map(item => item.tools).filter(filtertools => filtertools != null).join(', ');
    $('#tools').text(tools);
    var others = data.map(item => item.others).filter(filterother => filterother != null).join(', ');
    $('#others').text(others);

}


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function framework() {
    var isValid = true;

    $('select[required]').each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next('.error-message-framework').show();
            isValid = false;
        } else {
            input.next('.error-message-framework').hide();
        }
    });

    if (!isValid) {
        return;
    }

    var Qualification = new Object();
    Qualification.framework = $('#Framework').val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Qualification.AccountId = accid;
    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/Qualification',
        data: JSON.stringify(Qualification),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        //debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been added!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#ModalFramework').modal('hide');
            location.reload();
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Data Gagal dimasukkan!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#ModalFramework').modal('hide');
            location.reload();
        }
    })
}

function programmingLanguage() {
    var isValid = true;

    $('select[required]').each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next('.error-message-p').show();
            isValid = false;
        } else {
            input.next('.error-message-p').hide();
        }
    });

    if (!isValid) {
        return;
    }

    var Qualification = new Object();
    Qualification.programmingLanguage = $('#PLanguage').val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Qualification.AccountId = accid;
    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/Qualification',
        data: JSON.stringify(Qualification),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        //debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been added!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#ModalPLanguage').modal('hide');
            location.reload();
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Data Gagal dimasukkan!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#ModalPLanguage').modal('hide');
            location.reload();
        }
    })
}

