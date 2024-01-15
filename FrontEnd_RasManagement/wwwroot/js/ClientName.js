var table = null;
$(document).ready(function () {

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
                    return (
                        '<a class="text-warning" data-placement="left" style="font-size: 14pt"data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' +
                        row.id +
                        ')"><i class="fa fa-edit"></i></a>' +
                        "&nbsp;" +
                        '<a class="text-info" data-placement="left" style="font-size: 14pt" data-toggle="modal" data-animation="false" title="Edit" onclick="return detailPosition(' +
                        row.id +
                        ')"><i class="fas fa-info-circle"></i></i></a>' +
                        "&nbsp;" +
                        '<a class="text-danger" data-placement="right" style="font-size: 14pt"data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(\'' +
                        row.id +
                        "', '" +
                        row.nameOfClient +
                        "'" +
                        ')"><i class="fa fa-trash"></i></a>'
                    );
                },
            },
        ],

        order: [[1, "desc"]],
        //"responsive": true,
        //Buat ngilangin order kolom No dan Action
        columnDefs: [
            {
                targets: [0, 2],
                orderable: false,
            },
        ],
        //Agar nomor tidak berubah
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: "current" }).nodes();
            var currentPage = api.page.info().page; // Mendapatkan nomor halaman saat ini
            var startNumber = currentPage * api.page.info().length + 1; // Menghitung nomor awal baris pada halaman saat ini

            api.column(0, { page: "current" })
                .nodes()
                .each(function (cell, i) {
                    cell.innerHTML = startNumber + i; // Mengupdate nomor baris pada setiap halaman
                });
        },
    });
});

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

    var CLientName = new Object(); //object baru
    CLientName.nameOfClient = $("#clientName").val(); //value insert dari id pada input
    $.ajax({
        type: "POST",
        url: "https://localhost:7177/api/ClientName/AddValidasi",
        data: JSON.stringify(CLientName),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },

        success: function (result) {
            const logMessage = `Has added client ${CLientName.nameOfClient}`;
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
                    CLientName.nameOfClient +
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
    $("#Update").hide();
    $("#Save").show();
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

function ClearScreen() {
    $("#clientId").val("");
    $("#clientName").val("");
    $(".error-message").hide();
    $("#Update").hide();
    $("#Save").show();
}

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

    $.ajax({
        url: "https://localhost:7177/api/ClientName/ChangeData",
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
  
    $('#informationClientModal').modal("show");
    $('#clientId').val(id);
    fetch("https://localhost:7177/api/ClientName/" + id,
        {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
        }
    )
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Lakukan sesuatu dengan data yang diterima dari API
            var clientName = data.data.nameOfClient;
            $("#modalTitle").text("Position List " + clientName);

            //Get Data Position
            fetch("https://localhost:7177/api/Position/ByClientId?clientId=" + id,
                {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("Token"),
                    },
                }
            )
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    var dataContainer = document.getElementById("dataPositionContainer");
                
                    data.data.forEach(function (data) {
                        // Menambahkan data ke dalam container
                       
                        dataContainer.innerHTML += `
                            <div class="col-sm-6">
                                <div class="card mb-4" id="dataCardPosition">
                                         <div class="card-header p-1 pl-2 text-dark">
                                                Status :
                                            
                                                           <span id="status" class="${getStatusColorClass(data.status)}">${data.status}</span>
                                            
                                               
                                         </div>
                                         <div class="card-body text-dark pt-3 pb-3">
                                             
                                                       <div class="row">
                                                                <div class="col-9 ml-1">
                                                                           <h6 class="mb-0 font-weight-bolder">${data.positionClient}</h5>
                                                                </div>
                                                                <div class="col text-right">
                                                                     <a href="#" class="btn  ml-2 btn-sm p-0 text-info"  style="font-size: 14pt" data-bs-toggle="modal" data-tooltip="tooltip" title="Detail Employee"><i class="far fa-edit"></i></a>
                                                                </div>
                                                              
                                                       </div>
                                                        <div class="row ml-1">
                                                                 <h6>${data.level}</h6>
                                                       </div>

                                                       <div class="row">
                                                           
                                                                      <div class="col-md-3 ml-1">Quantity</div>
                                                                      <div class="col-md-0">: </div>
                                                                      <div class="col-md-8">${data.quantity}</div>

                                                       </div>
                                                       <div class="row ">
                                                           
                                                                      <div class="col-md-3 ml-1">Notes</div>
                                                                      <div class="col-md-0">:</div>
                                                                      <div class="col-md-8">${data.notes}</div>
                                                               
                                                        
                                                       </div>
                                                                                        
                
                                                    
                                         </div>
                                </div>
                            </div>
                                
                                 
                            `;
                    });
                    function getStatusColorClass(status) {
                        switch (status) {
                            case 'Hold':
                                return 'text-warning';
                            case 'Open':
                                return 'text-success'; 
                            case 'Closed':
                                return 'text-danger'
                            default:
                                return 'text-primary'; 
                        }
                    }
                })
                .catch(error => {
                    // Tangani kesalahan yang mungkin terjadi selama permintaan
                    console.error('Fetch error:', error);
                });
            var a = "https://localhost:7177/api/Position/ByClientId?clientId=1"
        })
        .catch(error => {
            // Tangani kesalahan yang mungkin terjadi selama permintaan
            console.error('Fetch error:', error);
        });



}

function clearScreenPosition() {
    // $("#clientId").val("");
    //$("#clientName").val("");
    var form = document.querySelector('#positionModal .needs-validation');
    $("#updatePosition").hide();
    $("#savePosition").show()
    form.classList.remove('was-validated');
    form.reset();
}

function savePosition() {

    const clientId = document.getElementById('clientId').value;
    const positionName = document.getElementById('positionName').value;
    const positionLevel = document.getElementById('positionLevel').value;
    const positionQuantity = document.getElementById('positionQuantity').value;
    const positionStatus = document.getElementById('positionStatus').value;
    const positionNotes = document.getElementById('positionNotes').value;

    // Loop over them and prevent submission
    var form = document.querySelector('#positionModal .needs-validation');

    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    const newPositionData = {

        "positionClient": positionName,
        "level": positionLevel,
        "quantity": positionQuantity,
        "status": positionStatus,
        "notes": positionNotes,
        "clientId": clientId
    };

    fetch("https://localhost:7177/api/Position",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            body: JSON.stringify(newPositionData),
        }
    )
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status == 200) {
                Swal.fire({
                    title: "Success!",
                    text: "Data Position has ben Added!",
                    icon: "success"
                });
                const logMessage = `Has added position ${newPositionData.positionName} in Client Id ${newPositionData.clientId}`;
                SaveLogUpdate(logMessage);
              
                $("#positionModal").modal("hide");
             
                var dataContainer = document.getElementById("dataPositionContainer");
                dataContainer.innerHTML = '';
                detailPosition(clientId);
   
            }
        })
        .catch(error => {
            // Tangani kesalahan yang mungkin terjadi selama permintaan
            console.error('Fetch error:', error);
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
    dataContainer.innerHTML = '';
}