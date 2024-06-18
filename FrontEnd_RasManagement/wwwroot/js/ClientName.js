// ClientName.js ini berisi code yang digunakan dalam menangani Manage Client data pada bagian Admin
// Digunakan dalam menangani view table Client, Edit Clietn, information client yang berisi beberapa position yang ditambahkan tambahkan setelah add sales projection
// Selanjutnya di file ini juga menangani Manage position yang ada di Manage Client data view, add, dan edit

var table = null;
var compare = {};
$(document).ready(function () {

    $(".skillset").select2({
        dropdownParent: $("#col-skillset"),
        tags: true,
    });
    var objDataToken = parseJwt(sessionStorage.getItem("Token"));

    if (objDataToken.RoleId == 7) {
        $(".btn-add-client").hide();
        $(".btn-new-position").hide();
    }

    $('input[required], input[required-client], select[required]').each(function () {
        $(this).prev('label').append('<span style="color: red;">*</span>');
    });


    // View Table Client, untuk menampilkan table manage client
    // disiini juga digunakan dalam memanggil function detailPosition untuk melihat detail position.
    table = $("#tbDataCleint").DataTable({
        responsive: true,

        ajax: {
            url: "https://localhost:7177/api/ClientName",
            type: "GET",
            datatype: "json",
            dataSrc: "data",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
        },

        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1 + ".";
                },
            },
            { data: "nameOfClient" },
            { data: "companyOrigin" },
            { data: "authority" },
            { data: "industry" },
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                data: null,
                render: function (data, type, row) {
                    var modalId = "modal-edit-" + data.id;
                    var deleteId = "modal-delete-" + data.id;

                    // Menyembunyikan ikon edit dan delete jika roleid adalah 7 (Manager)
                    var hideIcons = objDataToken.RoleId == 7 ? "d-none" : "";

                    return (
                        '<div class="text-center">' +
                        '<a class=" text-warning' +
                        hideIcons +
                        '" data-placement="left" style="font-size: 14pt" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' +
                        row.id +
                        ')"><i class="fas fa-pencil-alt edit-client"></i></a>' +
                        "&nbsp;" +
                        '<a class="text-primary" data-placement="left" style="font-size: 14pt" data-toggle="modal" data-animation="false" title="Edit" onclick="return detailPosition(' +
                        row.id +
                        ')"><i class="fas fa-info-circle"></i></a>' +
                        "&nbsp;" +
                        '<a class="text-danger ' +
                        hideIcons +
                        '" data-placement="right" style="font-size: 14pt" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(\'' +
                        row.id +
                        "', '" +
                        row.nameOfClient +
                        "'" +
                        ')"><i class="fas fa-trash delete-client"></i></a>' +
                        "</div>"
                    );
                },
            },
        ],

        order: [[1, "asc"]],
        columnDefs: [
            {
                targets: [0, 2],
                orderable: false,
                //visible: objDataToken.RoleId != 7,
            },
        ],
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: "current" }).nodes();
            var currentPage = api.page.info().page;
            var startNumber = currentPage * api.page.info().length + 1;

            api
                .column(0, { page: "current" })
                .nodes()
                .each(function (cell, i) {
                    cell.innerHTML = startNumber + i;
                });
        },
    });
});

function hideButtonAndActionForManager() {
    $(".btn-add-client").hide();
}


// Function berikut digunakan untuk menyimpan client, saat menambahkan client
// Terdapat beberapa validasi juga seperti required dan validasi pengecekan client
function Save() {
    var isValid = true;

    // Validasi select Industry
    var industrySelect = $("#Industry").val();
    if (!industrySelect) {
        $("#Industry").next(".error-message").show();
        isValid = false;
    } else {
        $("#Industry").next(".error-message").hide();
    }

    $("input[required-client]").each(function () {
        var element = $(this);
        if (!element.val()) {
            element.next(".error-message").show();
            isValid = false;
        } else {
            element.next(".error-message").hide();
        }
    });

    if (!isValid) {
        return;
    }

    var Client = {
        nameOfClient: $("#clientName").val(), //value insert dari id pada input
        salesName: $("#salesName1").val() + ($("#salesName2").val() ? ', ' + $("#salesName2").val() : ''), // Menggabungkan salesName1 dan salesName2 dengan tanda koma jika salesName2 diisi
        salesContact: $("#salesContact1").val() + ($("#salesContact2").val() ? ', ' + $("#salesContact2").val() : ''), //Menggabungkan salesContact1 dan salesContact2 dengan tanda koma jika salesContac2 diisi
        companyOrigin: $('#companyOrigin').val(),
        picClient: $('#picClient').val(),
        clientContact: $('#clientContact').val(),
        Industry: $('#Industry').val(),
        Authority: $('#Authority').val()

    }


    $.ajax({
        type: "POST",
        url: "https://localhost:7177/api/ClientName/AddValidasi",
        data: JSON.stringify(Client),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },

        success: function (result) {
            const logMessage = `Has added client ${Client.nameOfClient}`;
            SaveLogUpdate(logMessage);

            if (result.status == 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success...",
                    text: "Data has been added!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                $("#Modal").modal("hide");
                $("#tbDataCleint").DataTable().ajax.reload();
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                html:
                    "Client <span style='text-decoration: underline; font-weight: bold;'>" +
                    Client.nameOfClient +
                    "</span> already exists",
                showConfirmButton: false,
                timer: 1500,
            });
        },
    });
}

function ClearScreen() {
    $("#clientId").val("");
    $("#clientName").val("");
    $("#salesName1").val("");
    $("#salesName2").val("");
    $("#salesContact1").val("");
    $("#salesContact2").val("");
    $('#companyOrigin').val("");
    $("#picClient").val("");
    $("#clientContact").val("");
    $("#Authority").val("");
    $("#Industry").val("");

    $("#Update").hide();
    $("#Save").show();

    $("input[required-client], select[required-client]").each(function () {
        var input = $(this);

        input.next(".error-message").hide();
    });



}

function noHTML(input) {
    var value = input.value.replace(/<[^>]*>/g, "");
    var nohtml = value.replace(/[<>?/]/g, "");
    input.value = nohtml;
}

function handleInput(event, input) {
    // Menangani peristiwa oninput dan onpaste
    noHTML(input);
}

// Function ini digunakan untuk mendapatkan data client berdasarkan id
// Yang digunakan ketika ingin melakukan edit pada table client
// Kemudian akan di tampilkan value yang di dapat ke dalam form edit tersebut
function GetById(id) {

    $("#Modal input[required-client]").each(function () {
        var element = $(this);
        element.next(".error-message").hide();
    });

    if (document.getElementById("Industry").selectedIndex = "0") {
        $(".error-message").hide();
        $("#Industry").removeClass("error-message");
    }

    $.ajax({
        url: "https://localhost:7177/api/ClientName/" + id,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var obj = result.data;

            $("#clientId").val(obj.id);
            $("#clientName").val(obj.nameOfClient);

            // Memisahkan nilai salesName ke salesName1 dan salesName2 jika keduanya terisi
            if (obj.salesName) {
                var salesNames = obj.salesName.split(',');
                $("#salesName1").val(salesNames[0].trim());
                $("#salesName2").val(salesNames[1] ? salesNames[1].trim() : '');
            } else {
                $("#salesName1").val('');
                $("#salesName2").val('');
            }

            // Memisahkan nilai salesContact ke salesContact dan salesContact jika keduanya terisi
            if (obj.salesContact) {
                var salesContacts = obj.salesContact.split(',');
                $("#salesContact1").val(salesContacts[0].trim());
                $("#salesContact2").val(salesContacts[1] ? salesContacts[1].trim() : '');
            } else {
                $("#salesContact1").val('');
                $("#salesContact2").val('');
            }

            $("#companyOrigin").val(obj.companyOrigin);
            $("#picClient").val(obj.picClient);
            $("#clientContact").val(obj.clientContact);
            $("#Authority").val(obj.authority);
            $("#Industry").val(obj.industry);


            $("#Modal").modal("show");
            $("#Update").show();
            $("#Save").hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}


// Function ini digunakan dalam mengedit client
// Function akan berjalan ketika user klik tombol edit pada modal form edit client
function Update() {
    var isValid = true;

    var industrySelect = $("#Industry").val();
    if (!industrySelect) {
        $("#Industry").next(".error-message").show();
        isValid = false;
    } else {
        $("#Industry").next(".error-message").hide();
    }

    $("#Modal input[required-client]").each(function () {
        var element = $(this);
        if (!element.val()) {
            element.next(".error-message").show();
            isValid = false;
        } else {
            element.next(".error-message").hide();
        }
    });

    if (!isValid) {
        console.log(isValid)
        return;
    }



    var ClientName = new Object(); //object baru
    //ClientName.id = $("#clientId").val();
    //ClientName.nameOfClient = $("#clientName").val(); //value insert dari id pada input
    //ClientName.salesName = $("#salesName").val();
    //ClientName.salesContact = $("#salesContact").val();
    //ClientName.clientContact = $("#clientContact").val();
    //ClientName.picClient = $("#picClient").val();

    ClientName.id = $("#clientId").val();
    ClientName.nameOfClient = $("#clientName").val();

    // Memisahkan nilai salesName ke salesName1 dan salesName2 jika keduanya terisi
    ClientName.salesName = $("#salesName1").val() + ($("#salesName2").val() ? ', ' + $("#salesName2").val() : '');
    ClientName.salesContact = $("#salesContact1").val() + ($("#salesContact2").val() ? ', ' + $("#salesContact2").val() : '');
    ClientName.companyOrigin = $('#companyOrigin').val();
    ClientName.picClient = $("#picClient").val();
    ClientName.clientContact = $("#clientContact").val();
    ClientName.Authority = $('#Authority').val();
    ClientName.Industry = $('#Industry').val();



    $.ajax({
        url: "https://localhost:7177/api/ClientName",
        type: "PUT",
        data: JSON.stringify(ClientName),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },

        success: function (result) {
            const logMessage = `Has change client ${ClientName.id}`;
            SaveLogUpdate(logMessage);

            if (result.status == 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success...",
                    text: "Data has been updated!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                $("#Modal").modal("hide");
                $("#tbDataCleint").DataTable().ajax.reload();
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                html:
                    "Client <span style='text-decoration: underline; font-weight: bold;'>" +
                    ClientName.nameOfClient +
                    "</span> already exists",
                showConfirmButton: false,
                timer: 1500,
            });
        },
    });
}

// Function ini digunakan dalam menangani delete client
// Karena client ini terdapat FK pada table lainnya, jadi terdapat infromation Client tidak dapat dihapus ketika sudah terhubung ke table lain
// Parameter yang diterima dalam fucntioon ini adalah Id Client, dan nama dari client untuk di simpan ke dalam save log
function Delete(id, nameOfClient) {

    // cek index pagination
    var currentPageIndex = $("#tbDataCleint").DataTable().page.info().page;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {

        if (result.value) {
            $.ajax({
                url: "https://localhost:7177/api/ClientName/" + id,
                type: "DELETE",
                dataType: "json",

                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                success: function (result) {


                    // Functuion ini digunakan untuk melakukan penyimpana History Log kedalam server
                    // untuk menyimpan aktivitas admin
                    // untuk file utamanya ada di dalam historyLog.js
                    const logMessage = `Has deleted client ${nameOfClient}`;
                    SaveLogUpdate(logMessage);
                    Swal.fire("Deleted!", "Your data has been deleted.", "success");
              
                    $("#tbDataCleint").DataTable().ajax.reload(null, false);

                    // Setel kembali halaman tabel ke indeks yang disimpan
                    $("#tbDataCleint").DataTable().page(currentPageIndex).draw(false);

                },
                error: function (errormessage) {
                    Swal.fire("Error!", "Cant Delete, client Is Not Empty", "error");
                },

            });
        }
    });
}


// Berikut adalah function untuk menangani detail information yang ada pada manage client data yang kemudian akan menampilkan position
// Function berjalan ketika admin klik button info yang ada pada manage client data
// Function ini menerima parameter client id, yang digunakan untuk mendapatkan client berdasarkan id client
// Kemudian cleint id tersebut juga digunakan dalam mendapatkan position berdasarkan id client
// Terdapat 2 menu untuk menampilkan yaitu Show all dan Hide position yang di archive ( status position archive)
function detailPosition(id) {
    clearData();
    //Detail
    $("#informationClientModal").modal("show");
    $("#clientId").val(id);
    const showCheckbox = document.getElementById("showArchive");
    const statusIndicator_ = document.querySelector(".status-indicator_");
    fetch("https://localhost:7177/api/ClientName/" + id, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Lakukan sesuatu dengan data yang diterima dari API
            var clientName = data.data.nameOfClient;

            $("#modalTitle").text("Position List " + clientName);
            $("#salesName_").text(data.data.salesName);
            $("#salesContact_").text(data.data.salesContact);
            $("#picClient_").text(data.data.picClient);
            $("#clientContact_").text(data.data.clientContact);

            //Get Data Position
            fetch("https://localhost:7177/api/Position/ByClientId?clientId=" + id, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    var dataContainer = document.getElementById("dataPositionContainer");
                    statusIndicator_.textContent = "Show Archive Position";

                    // Code berikut menangani view position yang status nya != Archive 
                    data.data.forEach(function (data) {
                        if (data.status != "Archive") {
                            dataContainer.innerHTML += `
                            <div class="col-sm-6">
                                <div class="card mb-4" id="dataCardPosition">
                                    <div class="card-header p-1 pl-2 text-dark">
                                        Status : <span id="status" class="${getStatusColorClass(data.status)}">${data.status}</span>
                                    </div>
                                    <div class="card-body text-dark pt-3 pb-3">
                                        <div class="row align-items-center">
                                            <div class="col-4">
                                                <h6 class="mb-0 font-weight-bolder">${data.positionClient}</h5>
                                            </div>
                                            <div class="col-4">
                                                <h6 class="mb-0">${data.level
                                                            }</h6>
                                            </div>
                                            <div class="col-4 text-right">
                                                ${objDataToken.RoleId !=
                                                                7
                                                                ? `<a href="#" class="btn ml-2 btn-sm p-0 text-info" style="font-size: 14pt" data-bs-toggle="modal"
                                                    data-tooltip="tooltip" onclick="GetByIdPosition(${data.id})" title="Detail Employee"><i
                                                        class="far fa-edit"></i></a>`
                                                                : ""
                                                            }
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-4">Requirement</div>
                                            <div class="col-8 text-left">: ${data.skillSet
                                                            }</div>
                                        </div>
                                        <div class="row">
                                            <div class="col-4">Quantity</div>
                                            <div class="col-4 text-left">: ${data.quantity
                                                            }</div>
                                        </div>
                                        <div class="row ">
                                            <div class="col-4">Notes</div>
                                            <div class="col-4 text-left">: ${data.notes
                                                            }</div>
                                        </div>
                                        <div class="row ">
                                            <div class="col-4">Sales Projection</div>
                                            <div class="col-4 text-left">: ${data.sP_Id ?? 'Not Found'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
                        }
                    });

                    // Code ini digunakan untuk menampilkan position yang ber status Archive
                    // Seluruh Position akan tampil
                    // Dijalankan ketika admin klik check box show archive positon
                    showCheckbox.addEventListener("change", function () {
                        if (this.checked) {
                            statusIndicator_.textContent = "Hide Archive Position";
                            dataContainer.innerHTML = "";

                            // Tampilkan semua data termasuk yang di-archive
                            data.data.forEach(function (data) {
                                dataContainer.innerHTML += `
                            <div class="col-sm-6">
                                <div class="card mb-4" id="dataCardPosition">
                                         <div class="card-header p-1 pl-2 text-dark">
                                                Status :
                                            
                                                           <span id="status" class="${getStatusColorClass(
                                    data.status
                                )}">${data.status
                                    }</span>
                                            
                                               
                                         </div>
                                         <div class="card-body text-dark pt-3 pb-3">
                                             
                                                       <div class="row">
                                                                <div class="col-9 ml-1">
                                                                           <h6 class="mb-0 font-weight-bolder">${data.positionClient
                                    }</h5>
                                                                </div>
                                                                <div class="col text-right">
                                                                     ${objDataToken.RoleId !=
                                        7
                                        ? `<a href="#" class="btn  ml-2 btn-sm p-0 text-info"  style="font-size: 14pt" data-bs-toggle="modal" data-tooltip="tooltip" onclick="GetByIdPosition(${data.id})" title="Detail Employee"><i class="far fa-edit"></i></a>`
                                        : ""
                                    }
                                                                </div>
                                                              
                                                       </div>
                                                        <div class="row ml-1">
                                                                 <h6>${data.level
                                    }</h6>
                                                       </div>

                                                       <div class="row">
                                                           
                                                                      <div class="col-md-3 ml-1">Quantity</div>
                                                                      <div class="col-md-0">: </div>
                                                                      <div class="col-md-8">${data.quantity
                                    }</div>

                                                       </div>
                                                       <div class="row ">
                                                           
                                                                      <div class="col-md-3 ml-1">Notes</div>
                                                                      <div class="col-md-0">:</div>
                                                                      <div class="col-md-8">${data.notes
                                    }</div>
                                                               
                                                        
                                                       </div>
                                                                                        
                
                                                    
                                         </div>
                                </div>
                            </div>
                            `;
                            });
                        } else {
                            statusIndicator_.textContent = "Show Archive Position";
                            dataContainer.innerHTML = "";
                            data.data.forEach(function (data) {
                                if (data.status != "Archive") {
                                    dataContainer.innerHTML += `
                            <div class="col-sm-6">
                                <div class="card mb-4" id="dataCardPosition">
                                         <div class="card-header p-1 pl-2 text-dark">
                                                Status :
                                            
                                                           <span id="status" class="${getStatusColorClass(
                                        data.status
                                    )}">${data.status
                                        }</span>
                                            
                                               
                                         </div>
                                         <div class="card-body text-dark pt-3 pb-3">
                                             
                                                       <div class="row">
                                                                <div class="col-9 ml-1">
                                                                           <h6 class="mb-0 font-weight-bolder">${data.positionClient
                                        }</h5>
                                                                </div>
                                                                <div class="col text-right">
                                                                     ${objDataToken.RoleId !=
                                            7
                                            ? `<a href="#" class="btn  ml-2 btn-sm p-0 text-info"  style="font-size: 14pt" data-bs-toggle="modal" data-tooltip="tooltip" onclick="GetByIdPosition(${data.id})" title="Detail Employee"><i class="far fa-edit"></i></a>`
                                            : ""
                                        }
                                                                </div>
                                                              
                                                       </div>
                                                        <div class="row ml-1">
                                                                 <h6>${data.level
                                        }</h6>
                                                       </div>

                                                       <div class="row">
                                                           
                                                                      <div class="col-md-3 ml-1">Quantity</div>
                                                                      <div class="col-md-0">: </div>
                                                                      <div class="col-md-8">${data.quantity
                                        }</div>

                                                       </div>
                                                       <div class="row ">
                                                           
                                                                      <div class="col-md-3 ml-1">Notes</div>
                                                                      <div class="col-md-0">:</div>
                                                                      <div class="col-md-8">${data.notes
                                        }</div>
                                                               
                                                        
                                                       </div>
                                                                                        
                
                                                    
                                         </div>
                                </div>
                            </div>
                                
                                 
                            `;
                                }
                            });
                        }
                    });

                    function getStatusColorClass(status) {
                        switch (status) {
                            case "Hold":
                                return "text-warning";
                            case "Open":
                                return "text-success";
                            case "Closed":
                                return "text-danger";
                            case "Archive":
                                return "text-info";
                            default:
                                return "text-primary";
                        }
                    }
                })
                .catch((error) => {
                    // Tangani kesalahan yang mungkin terjadi selama permintaan
                    console.error("Fetch error:", error);
                });
            var a = "https://localhost:7177/api/Position/ByClientId?clientId=1";
        })
        .catch((error) => {
            // Tangani kesalahan yang mungkin terjadi selama permintaan
            console.error("Fetch error:", error);
        });



    //Form New Position
    $("#salesProject").select2({
        placeholder: "Choose...",
        dropdownParent: $("#row-select-project"),
        width: "100%",
        height: "100%",
        allowClear: false,
        tags: true,
    });
    $('#salesProject').find('option:not(:disabled)').remove();

    salesProjection(id);

}


// Function ini digunakan untuk mendapatkan position berdasarkan id kemudian di tampilkan dalam form edit position
// Function ini menerima parameter id position dan berjalan ketika admin klik tombol edit position yang akan
// Kemudian akan menampilkan data yang di dapat pada form edit position
function GetByIdPosition(id) {

    $.ajax({
        url: "https://localhost:7177/api/Position/" + id,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var obj = result.data;
            $("#client_Id").val(obj.clientId);
            $("#positionId").val(obj.id);

            const skillSelect = $("#skillset");
           
            let selectedSkillset;
            if (obj.skillSet && obj.skillSet.includes(",")) {

                if (obj.skillSet.includes(",")) {

                    selectedSkillset = obj.skillSet.split(", ");
                    selectedSkillset.forEach((value) => {
                        const optionNotExists =
                            skillSelect.find("option[value='" + value + "']").length === 0;

                        if (optionNotExists) {
                            const newOption = new Option(value, value, true, true);
                            skillSelect.append(newOption).trigger("change");
                        }
                    });
                } else {
                    selectedSkillset = [obj.skillSet];
                }
             
            } else {
           
                selectedSkillset = [obj.skillSet];
            }
           
           
            skillSelect.val(selectedSkillset).trigger("change");
            $("#positionName").val(obj.positionClient);
            $("#positionQuantity").val(obj.quantity);
            $("#positionStatus").val(obj.status);
            $("#positionLevel").val(obj.level);
            $("#positionNotes").val(obj.notes);
            //salesProjection(obj.clientId, obj.sP_Id)
            $("#salesProject").val(obj.sP_Id).trigger('change');
            $("#positionModal").modal("show");
            $("#updatePosition").show();
            $("#savePosition").hide();

            compare = {
                PositionName: obj.positionClient,
                Quantity: obj.quantity,
                Status: obj.status,
                Level: obj.level,
                Notes: obj.notes,
                sP_Id: obj.sP_Id,
                skillSet: obj.skillSet
            };

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}


// Function ini digunakan dalam mengirim update ke server
// Function berjalan ketika admin edit data position kemudian klik tombol edit
// Di dalam function ini juga terdapat save log message untuk menyimpan history log
function updatePosition() {

    var form = document.querySelector("#positionModal .needs-validation");

    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");
        return;
    }
    const clientId = document.getElementById("client_Id").value;
    const positionId = document.getElementById("positionId").value;
    const skillSet = $("#skillset").val().join(", ");
    const positionName = document.getElementById("positionName").value;
    const positionLevel = document.getElementById("positionLevel").value;
    const positionQuantity = document.getElementById("positionQuantity").value;
    const positionStatus = document.getElementById("positionStatus").value;
    const positionNotes = document.getElementById("positionNotes").value;
    const sP_Id = document.getElementById("salesProject").value;


    const position = {
        id: positionId,
        positionClient: positionName,
        level: positionLevel,
        quantity: positionQuantity,
        status: positionStatus,
        notes: positionNotes,
        clientId: clientId,
        sP_Id: sP_Id,
        skillSet: skillSet
    };
    console.log(position);
    if (position.positionClient == compare.PositionName &&
        position.level == compare.Level &&
        position.quantity == compare.Quantity &&
        position.status == compare.Status &&
        position.notes == compare.Notes &&
        position.sP_Id == compare.sP_Id &&
        position.skillSet == compare.skillSet
    ) {
        const logMessage = `Updated Position data with no changes detected, ${position.positionClient} in Client Id ${position.clientId}`;
        SaveLogUpdate(logMessage);
        Swal.fire({
            icon: "info",
            title: "No Changes Detected",
            text: "No data has been changed.",
            showConfirmButton: false,
            timer: 2000,
        });
        $("#positionModal").modal("hide");
        return;
    }
    //console.log(position);
    fetch("https://localhost:7177/api/Position", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        body: JSON.stringify(position),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.status == 200) {
                Swal.fire({
                    title: "Success!",
                    text: "Data Position has ben Updated!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                const logMessage = `Has Upated position ${position.positionClient} in Client Id ${position.clientId}`;
                SaveLogUpdate(logMessage);

                $("#positionModal").modal("hide");

                var dataContainer = document.getElementById("dataPositionContainer");
                dataContainer.innerHTML = "";
                detailPosition(clientId);
            }
        })
        .catch((error) => {
            // Tangani kesalahan yang mungkin terjadi selama permintaan
            console.error("Fetch error:", error);
        });
    console.log("clientId before calling detailPosition:", clientId);
}

// Function unutk melakukan clear screen position
function clearScreenPosition() {
    // $("#clientId").val("");
    //$("#clientName").val("");
    var form = document.querySelector("#positionModal .needs-validation");
    $("#updatePosition").hide();
    $("#savePosition").show();
    $("#row-info").hide();
    $("#salesProject").val("").trigger("change");
    




    form.classList.remove("was-validated");
    form.reset();
}


// Function ini digunakan untuk menyimpan position baru, dan mengirim data ke server
// Function ini juga terdapat save log history ketika berhasil menyimpan data position baru
function savePosition() {
    const clientId = document.getElementById("clientId").value;
    const positionName = document.getElementById("positionName").value;
    const skillSet = $("#skillset").val().join(", ");
    const positionLevel = document.getElementById("positionLevel").value;
    const positionQuantity = document.getElementById("positionQuantity").value;
    const positionStatus = document.getElementById("positionStatus").value;
    const positionNotes = document.getElementById("positionNotes").value;
    const sP_Id = document.getElementById("salesProject").value;


    // Loop over them and prevent submission
    var form = document.querySelector("#positionModal .needs-validation");
    var positionLevelSelect = document.getElementById("positionLevel");

    if (form.checkValidity() === false || !positionLevelSelect.value) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");
        return;
    }

    const newPositionData = {
        positionClient: positionName,
        skillSet: skillSet,
        level: positionLevel,
        quantity: positionQuantity,
        status: positionStatus,
        notes: positionNotes,
        clientId: clientId,
        sP_Id: sP_Id,
    };
    console.log(newPositionData);

    fetch("https://localhost:7177/api/Position/Insert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        body: JSON.stringify(newPositionData),
    })
        .then((response) => {
            if (response.status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    html: "Position in this Client Already Exists.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.status == 200) {
                Swal.fire({
                    title: "Success!",
                    text: "Data Position has ben Added!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                const logMessage = `Has added position ${positionName} in Client Id ${newPositionData.clientId}`;
                SaveLogUpdate(logMessage);

                $("#positionModal").modal("hide");

                var dataContainer = document.getElementById("dataPositionContainer");
                dataContainer.innerHTML = "";
                detailPosition(clientId);
            }
        })
        .catch((error) => {
            // Tangani kesalahan yang mungkin terjadi selama permintaan
            console.error("Fetch error:", error);
        });
    console.log("clientId before calling detailPosition:", clientId);
}

const closeButton = document.querySelector(
    '.btn.btn-danger[data-dismiss="modal"]'
);
closeButton.addEventListener("click", function () {
    // kode untuk menutup modal
});


// Function yang digunakan untuk melakukan clear html pada detail cilent atau saat view position
// Bertujuan untuk me reset tampilan ketika mengclose modal atau digunakan dalam kondisi2 tertentu
// agar view html tampilan position ter reset.
function clearData() {
    var dataContainer = document.getElementById("dataPositionContainer");
    dataContainer.innerHTML = "";
}


// Function berikut digunakan untuk mendapatkan data sales projection berdasarkan client id
// Ditampilkan saat menambahkan atau mengedit position
// Form tersebut menampilkan sales projection yang ada berdasarkan client yang dipilih
function salesProjection(id, selected) {
    $.ajax({
        url: 'https://localhost:7177/api/SalesProjection/byClientId?clientId=' + id,
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (projectData) {

            const select = document.getElementById('salesProject');
            if (!select) {
                console.error('Dropdown element not found');
                return;
            }
            const sp = projectData.data;
            sp.forEach(project => {

                const option = document.createElement('option');
                option.value = project.id;
                if (parseInt(selected) === parseInt(project.id)) {
                    option.selected = true
                }
                option.text = `${project.client.nameOfClient} - ${project.projectStatus} (${project.id})`;
                select.add(option);

            });


        },
        error: function (err) {
            console.error("error fetching data:" + err)
        }
    })
}

// Function berikut aktif ketika admin sedang memilih sales projection
// Digunakan dalam menampilkan info yang berbentuk card pada form add new position
$('#salesProject').change(function (e) {
    
    const rowInfo = document.getElementById('row-info')
    const cardInfo = document.getElementById('cardInfo');
    const value = this.value;
    if (value == "" || value == null) {
        return;
    }
    rowInfo.style.display = "block";
    $.ajax({
        url: 'https://localhost:7177/api/SalesProjection/' + value,
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (obj) {

            const data = obj.data;
            
            if (data.hiringNeeds !== null || data.hiringNeeds !== "") {
            
                rowInfo.style.display = "block";
             
                cardInfo.innerText = data.hiringNeeds;

            }


        },
        error: function (err) {
            console.error("error fetching data:" + err)
            rowInfo.style.display = "none";
        }
    })
    
    // cardInfo.innerText =
})



