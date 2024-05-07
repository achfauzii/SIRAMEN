const formModal = $('#Modal-addSalesProjection form');
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

    $("#RequestBy").select2({
        placeholder: "Choose ",
        dropdownParent: $("#colRequestBy"),
        width: "100%",
        height: "100%",
        allowClear: false,
        tags: true,
    });

    $("#Priority").select2({
        placeholder: "Choose ",
        dropdownParent: $("#colPriority"),
        width: "100%",
        height: "100%",
        allowClear: false,
        tags: true,
    });

    $("#Status").select2({
        placeholder: "Choose ",
        dropdownParent: $("#colStatus"),
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
    let endpointApi;
    $('#addSalesProjection').hide();
    switch (id.toLowerCase()) {
        case "momsales":
            endpointApi = "open";
            break;
        case "reopen":
            endpointApi = "re open";
            break;
        case "bestview":
            endpointApi = "best view";
            break;
        case "goals":
            endpointApi = "close win";
            break;
        case "lose":
            endpointApi = "close lose";
            break;
        default:
            endpointApi = "hold";
            $('#addSalesProjection').show();
            break;
    }
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
            { data: "entryDate" },
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
            { data:"priority"},
            { data:"attendees"},
            { data:"requestBy"},
            { data:"currentNews"},
            { data:"hiringNeeds"},
            { data:"timeline"},
            { data:"hiringProcess"},
            { data:"workLocation"},
            { data:"notes"},
            { data:"contractPeriode"},
            { data:"rateCard"},
            { data: "projectStatus" },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return (
                            `
                        <div class="d-flex flex-row">
                            <a href="#" class="btn  ml-1 btn-sm p-0 text-info"  style="font-size: 14pt" data-bs-toggle="modal" data-placement="left" data-tooltip="tooltip" title="Edit Status" onclick = "return GetById(${row.id})"><i class="far fa-edit"></i></a>
                        </div>
                        `
                    );
                },
                //visible: objDataToken.RoleId != 7,
            },
        ],
    });
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
                    idSales1.val(salesName??' ')
                    idSales2.val(' ')
                    if (salesName && salesName.includes(',')) {
                        let splitName = salesName.split(',');
                        idSales1.val(splitName[0])
                        idSales2.val(splitName[1])
                    }
                    salesContact.val(option.salesContact ?? " ");
                    nameOfClient.val(option.nameOfClient ?? " ");
                    companyOrigin.val(option.companyOrigin ??" ");
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


async function GetById(id) {
    ClearScreen();
    $('#Update').show()
    $('#Save').hide()
    const url = 'https://localhost:7177/api/SalesProjection/' + id;
    const fetchingData = await fetch(url, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        }
    })
    const response = await fetchingData.json()

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

        if (fieldValue === undefined ) {
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
    formModal.find('input').each(function (e) {
        $(this).val("");
    })
    formModal.find('select').each(function (e) {
        $(this).val("").trigger("change");
    })
    $(".error-message").hide();
}

function Update() {
    var isValid = true;
    formModal.find('input[required] ,select[required]').each(function (e) {
        var input = $(this);
        if (!input.val()) {
            input.next(".error-message").show();
            isValid = false;
        } else {
            input.next(".error-message").hide();
        }
    });

    if (!isValid) {
        return;
    }
    const dataToUpdate = {

    }
    $.ajax({
        url: 'https://localhost:7177/api/SalesProjection',
        type: 'PUT',
        dataType: 'json',
        data: dataToUpdate,
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (data) {

        },
        error: function (err) {
            console.error("error fetching data:" + err)
        }
    })
}

function Save() {
    var isValid = true;

    formModal.find('input[required] ,select[required]').each(function (e) {
        var input = $(this);
        if (!input.val()) {
            input.next(".error-message").show();
            isValid = false;
        } else {
            input.next(".error-message").hide();
        }
    });

    if (!isValid) {
        return;
    }

    const dataToUpdate = {

    }
    $.ajax({
        url: 'https://localhost:7177/api/SalesProjection',
        type: 'POST',
        dataType: 'json',
        data: dataToUpdate,
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (data) {

        },
        error: function (err) {
            console.error("error fetching data:" + err)
        }
    })

}