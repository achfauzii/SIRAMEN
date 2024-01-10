var table = null;

$(document).ready(function () {
    table = $("#trackingIntvw").DataTable({
        ajax: {
            url: "https://localhost:7177/api/Employees", // Your API endpoint
            type: "GET",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },

        },
        columns: [
            {
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1 + ".";
                },
            },
            {
                data: "fullname",
                render: function (data, type, row) {
                    if (type === "display" || type === "filter") {
                        // Format tanggal dalam format yang diinginkan
                        return moment(data).format("DD MMMM YYYY");
                    }
                    // Untuk tipe data lain, kembalikan data aslinya

                    return data;

                },
            },
            { data: "position" },
            { data: null },
            { data: null },
            { data: null },
            {
                data: null,
                render: function (data, type, row) {
                    return (
                        '<button class="btn btn-sm btn-warning mr-2 " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return getById(' +
                        row.id +
                        ')"><i class="fa fa-edit"></i></button >'
                    );
                },
            },
        ],
        order: [[1, 'desc']],
        columnDefs: [
            {
                targets: [0, 2, 3, 4, 5, 6, 7],
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
})