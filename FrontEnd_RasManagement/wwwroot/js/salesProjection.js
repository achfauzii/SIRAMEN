$(document).ready(function () {
    $('.nav-tabs .nav-item').find('a').each(function () {
            console.table($(this).attr('id'))
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
            endpointApi = "";
            break;
        case "reopen":
            endpointApi = "";
            break;
        case "bestview":
            endpointApi = "";
            break;
        case "goals":
            endpointApi = "";
            break;
        case "loss":
            endpointApi = "";
            break;
        default:
            endpointApi = "";
            $('#addSalesProjection').show();
            break;
    }

    table = $("#salesProjectionTable").DataTable({
        scrollX: true,
        order: [1, "asc"],
        ajax: {
            url:
                "https://localhost:7177/api/" + endpointApi,
            type: "GET",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            dataSrc: function (json) {
                // Menghapus data dengan status "On Progress"
                /*return json.data.filter(function (item) {
                    return item.statusApproval !== "On Progress";
                });*/
            },

        },

        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1 + ".";
                },
            },
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            {data:1},
            { data: 1 },
        ],
        order: [[2, "desc"]],
        columnDefs: [
            /*{
                targets: [0, 3, 4, 5, 6, 7, 8, 9],
                orderable: false,
            },*/
            {
                target: 10,
                visible: false,
                searchable: false
            },
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
