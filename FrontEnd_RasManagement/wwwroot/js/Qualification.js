
$(document).ready(function () {
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;


    $.ajax({
        url: "http://202.69.99.67:9001/api/Qualification/accountId?accountId=" + accid,
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

                    var buttonFramework = document.getElementById("buttonFramework");
                    var buttonProgramming = document.getElementById("buttonProgramming");
                    var buttonDatabase = document.getElementById("buttonDatabase");
                    var buttonTools = document.getElementById("buttonTools");
                    var buttonOthers = document.getElementById("buttonOthers");

                    buttonOthers.style.display = "none";
                    buttonProgramming.style.display = "none";
                    buttonDatabase.style.display = "none";
                    buttonTools.style.display = "none";
                    buttonFramework.style.display = "none";

                }

            } else {
                console.error('Error fetching data from API:', response.message);
            }
        },
        error: function (error) {
            console.error('Error fetching data from API:', error);
        }
    });
    $('.frameworkOptions').select2();



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

    $('#framework_').val(null).trigger('change');// Kosongkan pilihan select
    $('#customFramework').val(''); // Kosongkan input teks
    $('#programmingLanguage_').val(''); // Kosongkan input teks
    $('#qualDatabase').val(''); // Kosongkan input teks
    $('#tools_').val(''); // Kosongkan input teks
    $('#others_').val(''); // Kosongkan input teks
    $('.frameworkOptions').closest('.form-group').find('.error-message').hide();

    $('input[required_add]').each(function () {
        var input = $(this);
        input.next('.error-message').hide();
    });

}

function ClearScreenUpdate() {


    $('#frameworkUpdate').val(null).trigger('change');// Kosongkan pilihan select
    $('#programmingLanguageUpdate').val(''); // Kosongkan input teks

    $('#databaseUpdate').val(''); // Kosongkan input teks
    $('#toolsUpdate').val(''); // Kosongkan input teks
    $('#othersUpdate').val(''); // Kosongkan input teks
    $('#frameworkShow .error-message').hide();
    $('#programmingShow .error-message').hide();
    $('#databaseShow .error-message').hide();
    $('#toolsShow .error-message').hide();
    $('.frameworkOptions').closest('.form-group').find('.error-message').hide();

    $('input[required_add]').each(function () {
        var input = $(this);
        input.next('.error-message').hide();
    });

}

function Save() {
/*      debugger;
      var isValid = true;
  
      $('input[required_add]').each(function () {
          var input = $(this);
          if (!input.val()) {
              input.next('.error-message').show();  
              isValid = false;
          } else {
              input.next('.error-message').hide();
          }
      });*/

    // Validasi select options
    var selectedFrameworks = $('#framework_').val();
    var selectedProgramming = $('#programmingLanguage_').val();
    var selectedDatabase = $('#qualDatabase').val();

    if (!selectedFrameworks?.some(Boolean) || !selectedProgramming?.some(Boolean) || !selectedDatabase?.some(Boolean)) {
        $('.frameworkOptions').closest('.form-group').find('.error-message').show();
        isValid = false;
    } else {
        $('.frameworkOptions').closest('.form-group').find('.error-message').hide();
    }

    /*
        if (!isValid) {
    
            return;
        }*/
    var qualifications = new Object(); //bikin objek baru

    qualifications.framework = $('#framework_').val().join(", ");

    qualifications.programmingLanguage = $('#programmingLanguage_').val().join(", ");
    qualifications.database = $('#qualDatabase').val().join(", ");
    qualifications.tools = $('#tools_').val().join(", ");
    qualifications.others = $('#others_').val();

    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    qualifications.accountId = accid;
    $.ajax({
        type: 'POST',
        url: 'http://202.69.99.67:9001/api/Qualification',
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
                title: 'Data failed to added!',
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
        url: "http://202.69.99.67:9001/api/Qualification/accountId?accountId=" + accid,
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
            // Memecah string menjadi array dan mengisi nilai ke dalam Select2
            const selectedOptionsFramework = obj.framework;
            const selectedOptionsProgramming = obj.programmingLanguage;
            const selectedOptionsDatabase = obj.database;
            const selectedOptionsTools = obj.tools;
            const othersObj = obj.others;

            const frameworkSelect = $('#frameworkUpdate');

            const programmingLanguageSelect = $('#programmingLanguageUpdate');
            const databaseSelect = $('#databaseUpdate');
            const toolsSelect = $('#toolsUpdate');
            const othersInput = $('#othersUpdate');
           
        
            // Setiap nilai yang perlu diisi dalam Select2 diperlakukan sebagai array
            const selectedFrameworkArray = selectedOptionsFramework.split(', ');
            const selectedProgrammingArray = selectedOptionsProgramming.split(', ');
            const selectedDatabaseArray = selectedOptionsDatabase.split(', ');
            const selectedToolsArray = selectedOptionsTools.split(', ');


            // Set the value, creating a new option if necessary
            selectedFrameworkArray.forEach(value => {
                const optionNotExists = frameworkSelect.find("option[value='" + value + "']").length === 0;

                if (optionNotExists) {
                    const newOption = new Option(value, value, true, true);
                    frameworkSelect.append(newOption).trigger('change');
                }
            });

            // Set value to selectedFrameworkArray
            frameworkSelect.val(selectedFrameworkArray).trigger('change');

            selectedProgrammingArray.forEach(value => {
                const optionNotExists = programmingLanguageSelect.find("option[value='" + value + "']").length === 0;

                if (optionNotExists) {
                    const newOption = new Option(value, value, true, true);
                    programmingLanguageSelect.append(newOption).trigger('change');
                }
            });

            // Set value to selectedFrameworkArray
            programmingLanguageSelect.val(selectedProgrammingArray).trigger('change');


            selectedDatabaseArray.forEach(value => {
                const optionNotExists = databaseSelect.find("option[value='" + value + "']").length === 0;

                if (optionNotExists) {
                    const newOption = new Option(value, value, true, true);
                    databaseSelect.append(newOption).trigger('change');
                }
            });

            // Set value to selectedFrameworkArray
            databaseSelect.val(selectedDatabaseArray).trigger('change');


            selectedToolsArray.forEach(value => {
                const optionNotExists = toolsSelect.find("option[value='" + value + "']").length === 0;

                if (optionNotExists) {
                    const newOption = new Option(value, value, true, true);
                    toolsSelect.append(newOption).trigger('change');
                }
            });

            // Set value to selectedFrameworkArray
            toolsSelect.val(selectedToolsArray).trigger('change');   


            // Menginisialisasi Select2 dengan opsi tag
            frameworkSelect.select2({
                
                tags: true,
              
                createTag: function (params) {
                    return {
                        id: params.term,
                        text: params.term,
                        newTag: true
                    };
                }
            });

            programmingLanguageSelect.select2({
                tags: true,
                createTag: function (params) {
                    return {
                        id: params.term,
                        text: params.term,
                        newTag: true
                    };
                }
            });

            databaseSelect.select2({
                tags: true,
                createTag: function (params) {
                    return {
                        id: params.term,
                        text: params.term,
                        newTag: true
                    };
                }
            });

            toolsSelect.select2({
                tags: true,
                createTag: function (params) {
                    return {
                        id: params.term,
                        text: params.term,
                        newTag: true
                    };
                }
            });

            othersInput.val(othersObj);

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

function Update() {
    debugger;
    var isValid = true;
    // Validasi apakah field frameworkUpdate memiliki nilai yang dipilih
    var selectedFrameworks = $('#frameworkUpdate').val();
    if (!selectedFrameworks || selectedFrameworks.length === 0) {
        $('#frameworkShow .error-message').show();
        isValid = false;
    } else {
        $('#frameworkShow .error-message').hide();
    }

    // Validasi apakah field programmingLanguageUpdate memiliki nilai yang dipilih
    var selectedProgrammingLanguages = $('#programmingLanguageUpdate').val();
    if (!selectedProgrammingLanguages || selectedProgrammingLanguages.length === 0) {
        $('#programmingShow .error-message').show();
        isValid = false;
    } else {
        $('#programmingShow .error-message').hide();
    }

    // Validasi apakah field databaseUpdate memiliki nilai yang dipilih
    var selectedDatabases = $('#databaseUpdate').val();
    if (!selectedDatabases || selectedDatabases.length === 0) {
        $('#databaseShow .error-message').show();
        isValid = false;
    } else {
        $('#databaseShow .error-message').hide();
    }

    // Validasi apakah field toolsUpdate memiliki nilai yang dipilih
    var selectedTools = $('#toolsUpdate').val();
    if (!selectedTools || selectedTools.length === 0) {
        $('#toolsShow .error-message').show();
        isValid = false;
    } else {
        $('#toolsShow .error-message').hide();
    }

    if (!isValid) {
        return;
    }

    var qualifications = new Object(); //bikin objek baru
    qualifications.accountId = $('#accountId').val();

    qualifications.qualificationId = $('#qualificationId').val();
    qualifications.framework = $('#frameworkUpdate').val().join(", ");

    qualifications.programmingLanguage = $('#programmingLanguageUpdate').val().join(", ");
    qualifications.database = $('#databaseUpdate').val().join(", ");
    qualifications.tools = $('#toolsUpdate').val().join(", ");
    qualifications.others = $('#othersUpdate').val();
    
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    //console.log(qualifications);
    $.ajax({
        url: 'http://202.69.99.67:9001/api/Qualification',
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
            Swal.fire(
                'Error!',
                'Data failed to update',
                'error'
            )
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

