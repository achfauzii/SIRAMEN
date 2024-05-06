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

async function dataClient(id) {
    $.ajax({
        url: 'https://localhost:7177/api/ClientName/'+id,
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Beare " + sessionStorage.getItem("Token")
        },
        success: function (data) {
            console.log(data)
            $('#clientId').children('option:not(:disabled)').remove();
            data.data.forEach(function (option) {

                let optionElement = `<option>`;
                optionElement.attr('value', option);
                optionElement.text(option);

            })
        },
        error: function (err) {
            console.error("error fetching data:" + err)
        }
    })
}
async function GetById(id) {
    ClearScreen()
    const url = 'https://localhost:7177/api/SalesProjection/' + id;
    const fetchingData = await fetch(url, {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        }
    })
    const response = await fetchingData.json()
    dataClient(response.data.clientId)
}

function ClearScreen() {
    $('#Modal-addSalesProjection').modal('show')
    formModal.find('input').each(function (e) {
        $(this).val("");
    })
    formModal.find('select').each(function (e) {
        $(this).val("").trigger("change");
    })
}

function Update() {
    var isValid = true;
    //$('#id).find('option[value="'+data+'"]').attr('selected',true).trigger('change')

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
}
