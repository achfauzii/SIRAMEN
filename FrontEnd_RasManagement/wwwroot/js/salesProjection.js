const formModal = $('#Modal-addSalesProjection form');
let savedLocation;
$(document).ready(function () {


    $('.nav-tabs .nav-item').find('a').each(function () {
        $(this).on('click', function (e) {
            e.preventDefault();
            $('.nav-tabs .nav-item a').removeClass('active');
            $(this).addClass('active');
            generateData($(this).attr('id'))
        });
    })
    $('.nav-tabs .nav-item').find('a')[0].click()

    clientOption()
    $("#clientId").select2({
        placeholder: "Choose Client",
        dropdownParent: $("#Modal-addSalesProjection"),
        width: "100%",
        height: "100%",
        allowClear: false,
        tags: true,
    });

})

$('#clientId').change(function (e) {
    e.preventDefault();
    const selected = $(this).val()
    clientOption(selected)
})
function generateData(id) {
    $('#salesProjectionTable').DataTable().destroy();
    let endpointApi,color;
    $('#addSalesProjection').hide();
    switch (id.toLowerCase()) {
        case "momsales":
            endpointApi = "open";
            color = "secondary";
            break;
        case "reopen":
            endpointApi = "re open";
            color = "info";
            break;
        case "bestview":
            endpointApi = "best view";
            color = "light";
            break;
        case "goals":
            endpointApi = "close win";
            color = "success";
            break;
        case "lose":
            endpointApi = "close lose";
            color = "danger";
            break;
        default:
            endpointApi = "hold";
            color = "warning";
            $('#addSalesProjection').show();
            break;
    }


    if (endpointApi == "best view" || endpointApi =="close win") {
        $('#salesProjectionTable').DataTable().destroy();
        $('#salesProjectionTableBestViews').DataTable().destroy();
        $("#salesProjectionTable").hide();
        $("#salesProjectionTableBestViews").show();

        $("#salesProjectionTableBestViews").DataTable({
            scrollX: true,
            order: [1, "asc"],
            ajax: {
                url:
                    "https://localhost:7177/api/SalesProjection/byStatus?status=" + endpointApi.toLowerCase(),
                type: "GET",
                contentType: "application/json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                dataSrc: function (json) {
                    return json.data.map(function (item) {
                        const urlPosition = 'https://localhost:7177/api/Position/ByClientIdAndStatus?clientId=' + item.clientId + '&status=Fullfill';
                        $.ajax({
                            url: urlPosition,
                            type: 'GET',
                            dataType: 'json',
                            headers: {
                                Authorization: "Bearer " + sessionStorage.getItem("Token")
                            },
                            success: function (data) {
                                if (data.data && data.data.length > 0) {
                                  
                                    if (data.data.length > 1) {
                                        item.quantity = data.data.map(function (pos) {
                                            return pos.quantity;
                                        }).join(', ');

                                        item.position = data.data.map(function (pos) {
                                            return pos.positionClient;
                                        }).join(', ');

                                    } else {
                                        item.quantity = data.data[0].quantity; 
                                        item.position = data.data[0].positionClient;
                                    }
                                } else {
                                    item.quantity = null;
                                    item.position = null;
                                }
                            },
                            error: function (err) {
                               /* console.error("error fetching data:" + err);*/
                                item.quantity = null;
                                item.position = null;
                            },
                            async: false
                        });
                        return item;
                    });
                }
            },
            language: {
                emptyTable: "No data available in table"
            },

            columns: [
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1 + ".";
                    },
                },
                {
                    data: "client",
                    render: function (data) {
                        return data.nameOfClient;
                    }
                },
                {
                    data: "client",
                    render: function (data) {
                        return data.industry;
                    }
                },
                {
                    data: "quantity"             
                },

                { data: "position" },
                { data: "startedYear" },

                { data: "projectType" },

                { data: "contractPeriode" },

                { data: "rateCard" },

                { data: "salesProject" },
                {
                    data: "cogs",
                    visible: (endpointApi == "best view") ? false : true
                },
                {
                    data: "gpm",
                    visible: (endpointApi == "best view") ? false : true
                },
                {
                    data: "soNumber",
                    visible: (endpointApi == "best view") ? false : true
                },
                {
                    data: "notes",
                    visible: (endpointApi == "best view") ? false : true
                },
            
                {
                    data: null,
                    orderable: false,
                    render: function (data, type, row) {
                   
                        return (
                            `
                        <div class="d-flex flex-row">
                            <a href="#" class="btn  ml-1 btn-sm p-0 text-info"  style="font-size: 14pt" data-bs-toggle="modal" data-placement="left" data-tooltip="tooltip" title="Edit Status" onclick = "return GetById(${row.id},'${endpointApi}')"><i class="far fa-edit"></i></a>
                            <a href="" class="btn  ml-1 btn-sm p-0 text-primary"  style="font-size: 14pt" data-bs-toggle="modal" data-placement="left" data-tooltip="tooltip" title="Add Activity"  data-toggle="modal" data-target="#activityModal" onclick="setIdformActivity(${row.id})"><i class="fas fa-calendar-plus"></i></a>
                        </div>
                        `
                            
                        );
                    },
                    //visible: objDataToken.RoleId != 7,
                },
            ],
           
        });

    } else {
        $('#salesProjectionTableBestViews').DataTable().destroy();
        $('#salesProjectionTableBestViews').hide();
        $("#salesProjectionTable").show();
        $("#salesProjectionTable").DataTable({
            scrollX: true,
            order: [1, "asc"],
            ajax: {
                url:
                    "https://localhost:7177/api/SalesProjection/byStatus?status=" + endpointApi.toLowerCase(),
                type: "GET",
                contentType: "application/json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                dataSrc: function (json) {
                    return json.data
                },
            },
            language: {
                emptyTable: "No data available in table"
            },
            columns: [
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1 + ".";
                    },
                },
                {
                    data: "client",
                    render: function (data) {
                        return data.nameOfClient;
                    }
                },
                {
                    data: "client",
                    render: function (data) {
                        return data.companyOrigin;
                    }
                },
                {
                    data: "entryDate",
                    render: function (data) {
                        let date = moment.utc(data);
                        return date.format('ddd, D MMMM YYYY');
                    }
                },
                {
                    data: "client",
                    render: function (data) {
                        return data.industry;
                    }
                },
                {
                    data: "client",
                    render: function (data) {
                        return data.picClient;
                    }
                },
                { data: "priority" },
                { data: "client.authority" },
                { data: "attendees" },
                { data: "requestBy" },
                { data: "currentNews" },
                { data: "hiringNeeds" },
                { data: "timeline" },
                { data: "hiringProcess" },
                { data: "workLocation" },
                { data: "notes" },
                { data: "contractPeriode" },
                { data: "rateCard" },
                {
                    data: "projectStatus",
                    render: function (data) {
                        return `<button class="btn btn-block btn-${color}" style="font-size: 12px; pointer-events: none;">${data}</button>`
                    }
                },
                {
                    data: null,
                    orderable: false,
                    render: function (data, type, row) {
                        return (
                            `
                        <div class="d-flex flex-row">
                            <a href="#" class="btn  ml-1 btn-sm p-0 text-info"  style="font-size: 14pt" data-bs-toggle="modal" data-placement="left" data-tooltip="tooltip" title="Edit Status" onclick = "return GetById(${row.id},'${endpointApi}')"><i class="far fa-edit"></i></a>
                            <a href="" class="btn  ml-1 btn-sm p-0 text-primary"  style="font-size: 14pt" data-bs-toggle="modal" data-placement="left" data-tooltip="tooltip" title="Add Activity"  data-toggle="modal" data-target="#activityModal" onclick="setIdformActivity(${row.id})"><i class="fas fa-calendar-plus"></i></a>
                        </div>
                        `
                        );
                    },
                    //visible: objDataToken.RoleId != 7,
                },
            ],
        });

    }

}

function clientOption(selected) {
    $('#clientId').find('option:not(:disabled)').remove();

    $.ajax({
        url: 'https://localhost:7177/api/ClientName',
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (data) {

            let salesName
            let idSales1 = $('#sales1')
            let idSales2 = $('#sales2')
            let salesContact = $('#salesContact')
            let nameOfClient = $('#nameOfClient')
            let companyOrigin = $('#companyOrigin')
            let picClient = $('#picClient')
            let authority = $('#authority')
            let clientContact = $('#clientContact')
            let industry = $('#industry')


            idSales1.val("");
            idSales2.val("");
            salesContact.val("");
            nameOfClient.val("");
            companyOrigin.val("");
            picClient.val("");
            authority.val("");
            clientContact.val("");
            industry.val("");


            data.data.forEach(function (option) {
                let optionElement = $(`<option>`);
                optionElement.attr('value', option.id);
                optionElement.text(option.nameOfClient);
                if (parseInt(selected) === parseInt(option.id)) {
                    optionElement.attr('selected', true)

                    //salesName
                    salesName = option.salesName
                    idSales1.val(salesName ?? ' ')
                    idSales2.val(' ')
                    if (salesName && salesName.includes(',')) {
                        let splitName = salesName.split(',');
                        idSales1.val(splitName[0])
                        idSales2.val(splitName[1])
                    }
                    salesContact.val(option.salesContact ?? " ");
                    nameOfClient.val(option.nameOfClient ?? " ");
                    companyOrigin.val(option.companyOrigin ?? " ");
                    picClient.val(option.picClient ?? " ");
                    authority.val(option.authority ?? " ");
                    clientContact.val(option.clientContact ?? " ");
                    industry.val(option.industry ?? " ");

                }
                $('#clientId').append(optionElement);

            })
        },
        error: function (err) {
            console.error("error fetching data:" + err)
        }
    })
}


async function GetById(id, tableName) {
    ClearScreen();
    $('#Update').show()
    $('#Save').hide()
    $('#colStatusPro').show()
    $('#projectStatus').attr('required', true)
  
    $('#tableName').val(tableName);

    const url = 'https://localhost:7177/api/SalesProjection/' + id;
    const fetchingData = await fetch(url, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        }
    })
    const response = await fetchingData.json()

    if (response.data.projectStatus === "Best View") {
        document.getElementById("fieldBestView").style.display = "block";
    }

 
    const urlClient = 'https://localhost:7177/api/ClientName/' + response.data.clientId;
    const fetchingDataClient = await fetch(urlClient, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        }
    })
    const responseClient = await fetchingDataClient.json()

    clientOption(response.data.clientId)
    $('#Modal-addSalesProjection form').find('input, textarea').each(function () {
        const idForm = $(this).attr('id');
        let fieldValue = response.data[idForm];
    
        if (fieldValue === undefined) {
            fieldValue = responseClient.data[idForm]
        }

        if (fieldValue !== undefined) {
            $(this).val(fieldValue);
        }
    });
    $('#Modal-addSalesProjection form').find('select').each(function () {
        const idForm = $(this).attr('id');
        const fieldValue = response.data[idForm];
        console.log(fieldValue)
        if (fieldValue !== undefined) {
            $(this).val(fieldValue);
        }
    });
    $('#fieldBestView').find('input, select').each(function (e) {
        $(this).attr('required', true)
    })
    const fieldStatusPro = document.getElementById('projectStatus');

    fieldStatusPro.addEventListener('change', function () {
        const valStatusPro = $("#projectStatus").val();


        if (valStatusPro == "Best View") {
            document.getElementById("fieldBestView").style.display = "block";



            $('#startedYear').attr('required', true);
            $('#projectType').attr('required', true);
            $('#salesProject').attr('required', true)

        } else {
            return;
        }

    })
}

function ClearScreen() {
    $('#Modal-addSalesProjection').modal('show')
    $('#Update').hide()
    $('#Save').show()
    $('#colStatusPro').hide()
    $('#projectStatus').attr('required', false)
    document.getElementById('fieldBestView').style.display = 'none';
    $('#fieldBestView').find('input, select').each(function (e) {
        $(this).attr('required',false)
    })
    formModal.find('input, textarea').each(function (e) {
        $(this).val("");
    })
    formModal.find('select').each(function (e) {
        $(this).val("").trigger("change");
    })
    $(".error-message").hide();
}

function Update() {
    var isValid = true;
    const tableName = $('#tableName').val();
   
    formModal.find('input[required] ,select[required]').each(function (e) {
        var input = $(this);
        if (!input.val()) {
            input.closest('div .col').find('.error-message').show()
            isValid = false;
        } else {
            input.closest('div .col').find('.error-message').hide()
        }
    });

    if (!isValid) {
        return;
    }
    const dataToUpdate = {
        id: parseInt($('#id').val()),
        entryDate: $('#entryDate').val(),

        projectStatus: $('#projectStatus').find(":selected").val(),

        attendees: $('#attendees').val(),
        requestBy: $('#requestBy').find(":selected").val(),
        hiringNeeds: $('#hiringNeeds').val(),
        timeline: $('#timeline').val(),
        hiringProcess: $('#hiringProcess').val(),
        workLocation: $('#workLocation').val(),
        notes: $('#notes').val(),
        priority: $('#priority').find(":selected").val(),
        status: $('#status').find(":selected").val(),
        contractPeriode: $('#contractPeriode').val(),
        rateCard: $('#rateCard').val(),
        currentNews: $('#currentNews').val(),
        clientId: parseInt($('#clientId').find(":selected").val()),
        startedYear: $('#startedYear').val(),
        projectType: $('#projectType').val(),
        salesProject: $('#salesProject').val(),
    }
 
    $.ajax({
        url: 'https://localhost:7177/api/SalesProjection',
        type: 'PUT',
        contentType: "application/json",
        data: JSON.stringify(dataToUpdate),
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (data) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: `Data Sales Projection Moved to ${dataToUpdate.projectStatus}!`,
                showConfirmButton: false,
                timer: 1500,
            });
            $("#Modal-addSalesProjection").modal("hide");

            if (tableName === "best view") {
                $("#salesProjectionTableBestViews").DataTable().ajax.reload();
            } else {
                $("#salesProjectionTable").DataTable().ajax.reload();
            }
         
         
        },
        error: function (err) {
            console.error(err)
            Swal.fire("Error!", "Failed to Update", "error");

        }
    })
}

function Save() {
    var isValid = true;

    formModal.find('input[required] ,select[required], textarea[required]').each(function (e) {
        var input = $(this);
        if (!input.val()) {
            input.closest('div .col').find('.error-message').show()
            isValid = false;
        } else {
            input.closest('div .col').find('.error-message').hide()
        }
    });

    if (!isValid) {
        return;
    }

    const dataToInsert = {
        entryDate: new Date(),
        projectStatus: "Hold",
        attendees: $('#attendees').val(),
        requestBy: $('#requestBy').find(":selected").val(),
        hiringNeeds: $('#hiringNeeds').val(),
        timeline: $('#timeline').val(),
        hiringProcess: $('#hiringProcess').val(),
        workLocation: $('#workLocation').val(),
        notes: $('#notes').val(),
        priority: $('#priority').find(":selected").val(),
        status: $('#status').find(":selected").val(),
        contractPeriode: $('#contractPeriode').val(),
        rateCard: $('#rateCard').val(),
        currentNews: $('#currentNews').val(),
        clientId: parseInt($('#clientId').find(":selected").val()),
 
    }

  
    $.ajax({
        url: 'https://localhost:7177/api/SalesProjection',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(dataToInsert),
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (data) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: `Data Sales Projection Inserted!`,
                showConfirmButton: false,
                timer: 1500,
            });
            $("#Modal-addSalesProjection").modal("hide");
            $("#salesProjectionTable").DataTable().ajax.reload();
        },
        error: function (err) {
            console.error(err)
            Swal.fire("Error!", "Failed to Insert Data", "error");
        }
    })

}


function clearScreenModalActivity() {

    var form = document.getElementById('formActivity');
    form.reset();
    form.classList.remove("was-validated");
}

function setIdformActivity(spId) {
    clearScreenModalActivity();
    $("#spId").val(spId);
}

function saveActivity() {


    var form = document.getElementById('formActivity');

    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }


    const dataActivity = {
        "spId": parseInt($("#spId").val()),
        "activity": $("#inputActivity").val(),
        "date": $("#dateActivity").val()
    }
   
    $.ajax({
        url: 'https://localhost:7177/api/ActivitySalesProjection',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(dataActivity),
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (data) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: `Activity Inserted!`,
                showConfirmButton: false,
                timer: 1500,
            });
            $("#activityModal").modal("hide");
            $("#salesProjectionTable").DataTable().ajax.reload();
        },
        error: function (err) {
            console.error(err)
            Swal.fire("Error!", "Failed to Insert Data", "error");
        }
    })






}