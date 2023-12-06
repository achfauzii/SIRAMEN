var table = null;
$(document).ready(function () {
  table = $("#TB_HistoryLog").DataTable({
    responsive: true,
    ajax: {
      url: "https://localhost:7177/api/HistoryLog",
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
      { data: "name" },
      { data: "activity" },
      {
        data: null,
        render: function (data, type, row, meta) {
          let timeStamp = new Date(Date.parse(row.timeStamp));
          return (
            row.timeStamp.substr(11) + " " + timeStamp.toLocaleDateString()
          );
          //   return row.timeStamp.substr(11) + " " + row.timeStamp.substr(0, 10);
        },
      },
    ],

    order: [[3, "desc"]],
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
      api
        .column(1, { page: "current" })
        .data()
        .each(function (group, i) {
          $(rows)
            .eq(i)
            .find("td:first")
            .html(i + 1);
        });
    },
  });
});
