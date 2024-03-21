var table = null;
var compare = {};
$(document).ready(function () {
    var objDataToken = parseJwt(sessionStorage.getItem("Token"));

    if (objDataToken.RoleId == 7) {
        $(".btn-add-client").hide();
        $(".btn-new-position").hide();
    }

    $('input[required]').each(function () {
        $(this).prev('label').append('<span style="color: red;">*</span>');
    });

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
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                data: null,
                render: function (data, type, row) {
                    var modalId = "modal-edit-" + data.id;
                    var deleteId = "modal-delete-" + data.id;

                    // Menyembunyikan ikon edit dan delete jika roleid adalah 7 (Manager)
                    var hideIcons = objDataToken.RoleId == 7 ? "d-none" : "";

                    return (
                        '<a class="text-warning ' +
                        hideIcons +
                        '" data-placement="left" style="font-size: 14pt"data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' +
                        row.id +
                        ')"><i class="fa fa-edit edit-client"></i></a>' +
                        "&nbsp;" +
                        '<a class="text-info" data-placement="left" style="font-size: 14pt" data-toggle="modal" data-animation="false" title="Edit" onclick="return detailPosition(' +
                        row.id +
                        ')"><i class="fas fa-info-circle"></i></i></a>' +
                        "&nbsp;" +
                        '<a class="text-danger ' +
                        hideIcons +
                        '" data-placement="right" style="font-size: 14pt"data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(\'' +
                        row.id +
                        "', '" +
                        row.nameOfClient +
                        "'" +
                        ')"><i class="fa fa-trash delete-client"></i></a>'
                    );
                },
            },
        ],

        order: [[1, "desc"]],
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

function Save() {
    var isValid = true;

    $("input[required]").each(function () {
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
        nameOfClient : $("#clientName").val(), //value insert dari id pada input
        salesName : $('#salesName').val(),
        salesContact : $('#salesContact').val(),
        picClient : $('#picClient').val(),
        clientContact : $('#clientContact').val(),
}
    
    console.log(Client);
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
    $("#salesName").val("");
    $("#salesContact").val("");
    $("#picClient").val("");
    $("#clientContact").val("");
    $("#Update").hide();
    $("#Save").show();
    $("input[required]").each(function () {
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

//function ClearScreen() {
//    $("#clientId").val("");
//    $("#clientName").val("");
//    $(".error-message").hide();
//    $("#Update").hide();
//    $("#Save").show();
//}

function GetById(id) {
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
            $("#salesName").val(obj.salesName);
            $("#salesContact").val(obj.salesContact);
            $("#clientContact").val(obj.clientContact);
            $("#picClient").val(obj.picClient);
            $("#Modal").modal("show");
            $("#Update").show();
            $("#Save").hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

function Update() {
    var isValid = true;

    $("input[required]").each(function () {
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

    var ClientName = new Object(); //object baru
    ClientName.id = $("#clientId").val();
    ClientName.nameOfClient = $("#clientName").val(); //value insert dari id pada input
    ClientName.salesName = $("#salesName").val();
    ClientName.salesContact = $("#salesContact").val();
    ClientName.clientContact = $("#clientContact").val();
    ClientName.picClient = $("#picClient").val();
 
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

function Delete(id, nameOfClient) {
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
                    const logMessage = `Has deleted client ${nameOfClient}`;
                    SaveLogUpdate(logMessage);
                    Swal.fire("Deleted!", "Your data has been deleted.", "success");
                    $("#tbDataCleint").DataTable().ajax.reload();
                },
                error: function (errormessage) {
                    Swal.fire("Error!", "Cant Delete, client Is Not Empty", "error");
                },
            });
        }
    });
}

function detailPosition(id) {
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
}

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
            $("#positionName").val(obj.positionClient);
            $("#positionQuantity").val(obj.quantity);
            $("#positionStatus").val(obj.status);
            $("#positionLevel").val(obj.level);
            $("#positionNotes").val(obj.notes);
            $("#positionModal").modal("show");
            $("#updatePosition").show();
            $("#savePosition").hide();

            compare = {
                PositionName: obj.positionClient,
                Quantity: obj.quantity,
                Status: obj.status,
                Level: obj.level,
                Notes: obj.notes

            };

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

function updatePosition() {
    debugger;
    var form = document.querySelector("#positionModal .needs-validation");

    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");
        return;
    }
    const clientId = document.getElementById("client_Id").value;
    const positionId = document.getElementById("positionId").value;
    const positionName = document.getElementById("positionName").value;
    const positionLevel = document.getElementById("positionLevel").value;
    const positionQuantity = document.getElementById("positionQuantity").value;
    const positionStatus = document.getElementById("positionStatus").value;
    const positionNotes = document.getElementById("positionNotes").value;

    const position = {
        id: positionId,
        positionClient: positionName,
        level: positionLevel,
        quantity: positionQuantity,
        status: positionStatus,
        notes: positionNotes,
        clientId: clientId,
    };

    if (position.positionClient == compare.PositionName &&
        position.level == compare.Level &&
        position.quantity == compare.Quantity &&
        position.status == compare.Status &&
        position.notes == compare.Notes
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

function clearScreenPosition() {
    // $("#clientId").val("");
    //$("#clientName").val("");
    var form = document.querySelector("#positionModal .needs-validation");
    $("#updatePosition").hide();
    $("#savePosition").show();

    form.classList.remove("was-validated");
    form.reset();
}

function savePosition() {
    const clientId = document.getElementById("clientId").value;
    const positionName = document.getElementById("positionName").value;
    const positionLevel = document.getElementById("positionLevel").value;
    const positionQuantity = document.getElementById("positionQuantity").value;
    const positionStatus = document.getElementById("positionStatus").value;
    const positionNotes = document.getElementById("positionNotes").value;

    // Loop over them and prevent submission
    var form = document.querySelector("#positionModal .needs-validation");

    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");
        return;
    }

    const newPositionData = {
        positionClient: positionName,
        level: positionLevel,
        quantity: positionQuantity,
        status: positionStatus,
        notes: positionNotes,
        clientId: clientId,
    };

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

function clearData() {
    var dataContainer = document.getElementById("dataPositionContainer");
    dataContainer.innerHTML = "";
}
