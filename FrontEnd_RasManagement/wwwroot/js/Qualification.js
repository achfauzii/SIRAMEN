
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
            debugger;
            if (response.status === 200) {
                displayQualification(response.data);
                if (response.data == "") {
                    var element = document.getElementById("buttonAdd");
                    element.style.display = "block"; // Menampilkan elemen

                }
         
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
    var frameworks = data.map(item => item.framework).join(', ');
    $('#framework').text(frameworks);
    var programmingLanguages = data.map(item => item.programmingLanguage).join(', ');
    $('#programming').text(programmingLanguages);
    var databases = data.map(item => item.database).join(', ');
    $('#databases').text(databases);
    var tools = data.map(item => item.tools).join(', ');
    $('#tools').text(tools);
    var others = data.map(item => item.others).join(', ');
    $('#others').text(others);

}

function ClearScreen() {

    /* $('#departmentId').val('');
     $('#departmentName').val('');*/

    var accountId = accountId;
    $.ajax({
        type: 'GET',
        url: 'https://localhost:7177/api/Qualification/accountId?accountId=' + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        /*headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('tokenJWT')
        },*/
    }).then((result) => {
        /*    $('#modal-add').modal('hide');
            $('#modal-add').on('hidden.bs.modal', function () {
                $(this).data('bs.modal', null);
            });*/
        //debugger;

        //$('#modal-add').modal('hide'); // hanya hide modal tetapi tidak menutup DOM nya
        var obj = result.data; //data yg didapat dari api
        $('#companyName').val(obj.companyName);

        $('#Update').show();
        $('#Add').hide();

    })
    /*  $('#companyName').val('');
      $('#placementStatus').val('');
      $('#description').val('');
      $('#accountId').val('');*/
    $('#Update').hide();
    $('#Add').show();


}

function Save() {
    debugger;
    var isValid = true;

    $('input[required_add]').each(function () {
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
    var qualifications= new Object(); //bikin objek baru
    qualifications.framework = $('#framework_').val();
    qualifications.programmingLanguage = $('#programmingLanguage_').val();
    qualifications.database = $('#qualDatabase').val();
    qualifications.tools = $('#tools_').val();
    qualifications.others = $('#others_').val();

    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    qualifications.accountId = accid;
    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/Qualification',
        data: JSON.stringify(qualifications), //ngirim data ke api
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        //debugger;
        if (result.status == result.status == 201 || result.status == 204 || result.status == 200) {
            //alert("Data Berhasil Dimasukkan");
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been added!',
                showConfirmButton: false,
                timer: 1500
            })
            $('#modalAdd').modal('hide');
            location.reload();
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Data Gagal dimasukkan!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#modalAdd').modal('hide');
            location.reload();
        }
    })
}


function updateFramework() {
    getbyID();
    var frameworkInput = document.getElementById("frameworkShow");
    var programmingInput = document.getElementById("programmingShow");
    var databaseInput = document.getElementById("databaseShow");
    var toolsInput = document.getElementById("toolsShow");
    var othersInput = document.getElementById("othersShow");
    frameworkInput.style.display = "block";
    programmingInput.style.display = "none";
    databaseInput.style.display = "none";
    toolsInput.style.display = "none";
    othersInput.style.display = "none";
}

function updateProgramming() {
    getbyID();
    var frameworkInput = document.getElementById("frameworkShow");
    var programmingInput = document.getElementById("programmingShow");
    var databaseInput = document.getElementById("databaseShow");
    var toolsInput = document.getElementById("toolsShow");
    var othersInput = document.getElementById("othersShow");
    frameworkInput.style.display = "none";
    programmingInput.style.display = "block";
    databaseInput.style.display = "none";
    toolsInput.style.display = "none";
    othersInput.style.display = "none";
}
function updateDatabase() {
    getbyID();
    var frameworkInput = document.getElementById("frameworkShow");
    var programmingInput = document.getElementById("programmingShow");
    var databaseInput = document.getElementById("databaseShow");
    var toolsInput = document.getElementById("toolsShow");
    var othersInput = document.getElementById("othersShow");
    frameworkInput.style.display = "none";
    programmingInput.style.display = "none";
    databaseInput.style.display = "block";
    toolsInput.style.display = "none";
    othersInput.style.display = "none";
}

function updateTools() {
    getbyID();
    var frameworkInput = document.getElementById("frameworkShow");
    var programmingInput = document.getElementById("programmingShow");
    var databaseInput = document.getElementById("databaseShow");
    var toolsInput = document.getElementById("toolsShow");
    var othersInput = document.getElementById("othersShow");
    frameworkInput.style.display = "none";
    programmingInput.style.display = "none";
    databaseInput.style.display = "none";
    toolsInput.style.display = "block";
    othersInput.style.display = "none";
}

function updateOthers() {
    getbyID();
    var frameworkInput = document.getElementById("frameworkShow");
    var programmingInput = document.getElementById("programmingShow");
    var databaseInput = document.getElementById("databaseShow");
    var toolsInput = document.getElementById("toolsShow");
    var othersInput = document.getElementById("othersShow");
    frameworkInput.style.display = "none";
    programmingInput.style.display = "none";
    databaseInput.style.display = "none";
    toolsInput.style.display = "none";
    othersInput.style.display = "block";
}


function getbyID() {
    debugger;
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    $.ajax({
        url: "https://localhost:7177/api/Qualification/accountId?accountId=" + accid,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            //debugger;
            var obj = result.data[0]; //data yg dapet dr id
            $('#accountId').val(accid); 
            $('#qualificationId').val(obj.qualificationId); 
            $('#frameworkUpdate').val(obj.framework); 
            $('#programmingLanguageUpdate').val(obj.programmingLanguage); 
            $('#databaseUpdate').val(obj.database); 
            $('#toolsUpdate').val(obj.tools); 
            $('#othersUpdate').val(obj.others); 
            
     
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function Update() {
    //debugger;
  
    var qualifications = new Object(); //bikin objek baru
    qualifications.accountId = $('#accountId').val();
    qualifications.qualificationId = $('#qualificationId').val();
    qualifications.framework = $('#frameworkUpdate').val();
    qualifications.programmingLanguage = $('#programmingLanguageUpdate').val();
    qualifications.database = $('#databaseUpdate').val();
    qualifications.tools = $('#toolsUpdate').val();
    qualifications.others = $('#othersUpdate').val();
/*    qualifications.programmingLanguage = $('#programmingLanguage_').val();
    qualifications.database = $('#qualDatabase').val();
    qualifications.tools = $('#tools_').val();
    qualifications.others = $('#others_').val();*/
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    console.log(qualifications);
    $.ajax({
        url: 'https://localhost:7177/api/Qualification',
        type: 'PUT',
        data: JSON.stringify(qualifications),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        $('#modalFramework').modal('hide');
        if (result.status == 200) {
            Swal.fire({
                title: "Success!",
                text: "Data has been update!",
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


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

