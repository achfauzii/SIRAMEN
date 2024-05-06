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
            { data:"requestBy"},
            { data:"hiringNeeds"},
            { data:"timeline"},
            { data:"hiringProcess"},
            { data:"workLocation"},
            { data:"notes"},
            { data:"contractPeriode"},
            { data:"rateCard"},
            { data:"projectStatus"},
            { data: "requestBy" },
        ],
        columnDefs: [
            
        ],
        createdRow: function (row, data, dataIndex) {

        },
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: "current" }).nodes();
            var currentPage = api.page.info().page; // Mendapatkan nomor halaman saat ini
            var startNumber = currentPage * api.page.info().length + 1; // Menghitung nomor awal baris pada halaman saat ini

            api
                .column(0, { page: "current" })
                .nodes()
                .each(function (cell, i) {
                    cell.innerHTML = startNumber + i; // Mengupdate nomor baris pada setiap halaman
                });
        },
    });
}
