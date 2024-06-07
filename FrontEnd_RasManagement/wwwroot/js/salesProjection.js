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

        dropdownParent: $("#col-select-client"),

        width: "100%",
        height: "100%",
        allowClear: false,
        tags: true,
    });

    $('input[required], textarea[required]').each(function () {
        $(this).prev('label').append('<span style="color: red;">*</span>');
    });

})

$('#clientId').change(function (e) {
    e.preventDefault();
    const selected = $(this).val()
    clientOption(selected)
})

$('#projectStatus').change(function (e) {
    switch ($(this).val()) {
        case "Best View":
            $('#fieldBestView').show()
            $('#startedYear').attr('required', true);
            $('#projectType').attr('required', true);
            $('#salesProject').attr('required', true);
            break;
        case "Close Win":
            $('#fieldBestView').show()
            $('#fieldGoals').show()
            $('#startedYear').attr('required', true);
            $('#projectType').attr('required', true);
            $('#salesProject').attr('required', true)
            $('#cogs').attr('required', true);
            $('#soNumber').attr('required', true);
            break;
        default:
            $('#fieldGoals').hide()
            $('#fieldBestView').hide()
            $('#startedYear').attr('required', false);
            $('#projectType').attr('required', false);
            $('#salesProject').attr('required', false)
            $('#cogs').attr('required', false);
            $('#soNumber').attr('required', false);
            break;
    }
})
$("#rateCard").on("input", function () {
    var jobSpecValue = $(this).val();
    var lines = jobSpecValue.split("\n");
    for (var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(/^•\s*/, "");
        if (lines[i].trim() !== "" && !lines[i].startsWith("• ")) {
            lines[i] = "• " + lines[i];
        }
    }

    var formattedJobSpec = lines.join("\n");
    $(this).val(formattedJobSpec);
});

$("#rateCard").on("keypress", function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        var currentValue = $(this).val();
        if (currentValue.trim() !== "") {
            currentValue += "\n";
            $(this).val(currentValue);
        }
    }
});

function generateData(id) {
    $('#salesProjectionTable').DataTable().destroy();
    let endpointApi, color;
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


    if (endpointApi == "best view" || endpointApi == "close win") {
        $('#salesProjectionTable').DataTable().destroy();
        $('#salesProjectionTableBestViews').DataTable().destroy();
        $("#salesProjectionTable").hide();
        $("#salesProjectionTableBestViews").show();

        $("#salesProjectionTableBestViews").DataTable({
            scrollX: true,
            order: [0, "asc"],
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
                    data: "position",
                    render: function (data) {

                        if (!data) {
                            return '';
                        }

                        //bagde warna untuk posisi

                        if (typeof data === 'string') {
                            var positions = data.split(',');
                            return positions.map(function (position, index) {
                                var badgeClass = index % 2 === 0 ? 'bg-dark text-light' : 'bg-warning text-dark';
                                return '<span class="badge ' + badgeClass + '">' + position.trim() + '</span><br>';
                            }).join(' ');
                        } else {
                            return '<span class="badge bg-dark text-light">' + data + '</span>';
                        }
                    }
                },

                {
                    data: "quantity",
                    render: function (data) {

                        if (!data) {
                            return '';
                        }
                        //badge warna untuk 

                        if (typeof data === 'string') {
                            var quantity = data.split(',');
                            return quantity.map(function (quantity, index) {
                                var badgeClass = index % 2 === 0 ? 'bg-dark text-light' : 'bg-warning text-dark';
                                return '<span class="badge ' + badgeClass + '">' + quantity.trim() + '</span><br>';
                            }).join(' ');
                        } else {
                            return '<span class="badge bg-dark text-light">' + data + '</span>';
                        }
                    }

                },
                { data: "startedYear" },

                { data: "projectType" },

                { data: "contractPeriode" },

                {
                    data: "rateCard",
                    render: function (data) {
                        var items = data.split("• ");
                        var list = "<ul>";
                        for (var i = 1; i < items.length; i++) {
                            list += "<li>" + items[i] + "</li>";
                        }
                        list += "</ul>";

                        return list;
                    },
                },

                {
                    data: "salesProject",
                    render: function (data, type, row) {
                        return "Rp " + data;
                    }
                },
                {
                    data: "cogs",
                    visible: (endpointApi == "best view") ? false : true,
                    render: function (data, type, row) {
                        return "Rp " + data;
                    }
                },
                {
                    data: "gpm",
                    visible: (endpointApi == "best view") ? false : true,
                    render: function (data, type, row) {
                        return "Rp " + data;
                    }
                },
                {
                    data: "soNumber",
                    visible: (endpointApi == "best view") ? false : true
                },
                {
                    data: "notes"
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
            "footerCallback": function (row, data, start, end, display) {
                var api = this.api(), data;

                // Change to int
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // Total over all pages
                totalGpm = api
                    .column(11)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total over this page
                pageTotalGpm = api
                    .column(11, { page: 'current' })
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);


                // Text Total
                (endpointApi == "close win") ?
                    $(api.column(0).footer()).html(
                        'Total'
                    ) : $(api.column(0).footer()).html(
                        ''
                    );

                // Update footer for GPM
                $(api.column(11).footer()).html(
                    'Rp ' + pageTotalGpm
                );
            }
        });


    } else {
        $('#salesProjectionTableBestViews').DataTable().destroy();
        $('#salesProjectionTableBestViews').hide();
        $("#salesProjectionTable").show();
        $("#salesProjectionTable").DataTable({
            scrollX: true,
            order: [0, "asc"],
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
                {
                    data: "rateCard",
                    render: function (data) {
                        var items = data.split("• ");
                        var list = "<ul>";
                        for (var i = 1; i < items.length; i++) {
                            list += "<li>" + items[i] + "</li>";
                        }
                        list += "</ul>";

                        return list;
                    },
                },
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
            let salesContact 
            let salesContact1 = $('#salesContact1')
            let salesContact2 = $('#salesContact2')
            let nameOfClient = $('#nameOfClient')
            let companyOrigin = $('#companyOrigin')
            let picClient = $('#picClient')
            let authority = $('#authority')
            let clientContact = $('#clientContact')
            let industry = $('#industry')


            idSales1.val("");
            idSales2.val("");
            salesContact1.val("");
            salesContact2.val("");
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
                    //salesContact
                    salesContact = option.salesContact
                    salesContact1.val(salesContact ?? ' ')
                    salesContact2.val(' ')
                    if (salesContact && salesContact.includes(',')) {
                        let splitName = salesContact.split(',');
                        salesContact1.val(splitName[0])
                        salesContact2.val(splitName[1])
                    }
                    //salesContact.val(option.salesContact ?? " ");
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
        $('#fieldBestView').show()
    }
    if (response.data.projectStatus === "Close Win") {
        $('#fieldGoals').show()
    }


    const urlClient = 'https://localhost:7177/api/ClientName/' + response.data.clientId;
    const fetchingDataClient = await fetch(urlClient, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        }
    })
    const responseClient = await fetchingDataClient.json()
    sessionStorage.setItem('prevStatus', response.data.projectStatus)

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
        if (fieldValue !== undefined) {
            $(this).val(fieldValue);
        }
    });


}

function ClearScreen() {
    $('#Modal-addSalesProjection').modal('show')
    $('#Update').hide()
    $('#Save').show()
    $('#colStatusPro').hide()
    $('#fieldBestView').hide()
    $('#fieldGoals').hide()
    $('#fieldBestView').find('input, select').each(function (e) {
        $(this).val("")
        $(this).attr('required', false)
    })
    $('#fieldGoals').find('input').each(function (e) {
        $(this).val("")
        $(this).attr('required', false)
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
    const prevStat = sessionStorage.getItem('prevStatus')
    var isValid = true;
    const tableName = $('#tableName').val();

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
        salesProject: parseInt($('#salesProject').val()),
        cogs: parseInt($('#cogs').val()),
        gpm: parseInt($('#salesProject').val()) - parseInt($('#cogs').val()),
        soNumber: parseInt($('#soNumber').val()),
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
            let movedTo = dataToUpdate.projectStatus === "Open" ? "MOM Sales" : dataToUpdate.projectStatus
            let mess = prevStat !== dataToUpdate.projectStatus ? `Data Sales Projection Moved to ${movedTo}!` : `Data has been updated`

            Swal.fire({
                icon: "success",
                title: "Success...",
                text: mess,
                showConfirmButton: false,
                timer: 1500,
            });
            $("#Modal-addSalesProjection").modal("hide");

            if (tableName === "best view" || tableName === "close win") {
                $("#salesProjectionTableBestViews").DataTable().ajax.reload();
            } else {
                $("#salesProjectionTable").DataTable().ajax.reload();
            }
            const logMessage = `Has Update Sales Pojection, Sp_Id : ${dataToUpdate.id}`;
            SaveLogUpdate(logMessage);


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
    var rateCard = $("#rateCard").val();
    var rateCardd = rateCard.split('\n').map(function (line) {
        return line.trim();
    }).filter(function (line) {
        return line !== '';
    }).join('\n');
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
        rateCard: rateCardd,
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
            const logMessage = `Has added Sales Pojection, Hiring Needs ${dataToInsert.hiringNeeds}, to Client Id: ${dataToInsert.clientId}`;
            SaveLogUpdate(logMessage);
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
            //$("#salesProjectionTable").DataTable().ajax.reload();
            //$("#salesProjectionTableBestViews").DataTable().ajax.reload();
        },
        error: function (err) {
            console.error(err)
            Swal.fire("Error!", "Failed to Insert Data", "error");
        }
    })






}

