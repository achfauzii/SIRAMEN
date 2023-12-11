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
          data: "timeStamp",
          type: "date",
      },
    ],

    order: [[3, "desc"]],
    columnDefs: [
      {
        targets: [0, 2],
        orderable: false,
      },
      {
        targets: 3,
        render: function (data, type, row, meta) {
          let timeStamp = new Date(Date.parse(row.timeStamp));
          const formatter = new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          return row.timeStamp.substr(11) + " " + formatter.format(timeStamp);
          //   return row.timeStamp.substr(11) + " " + row.timeStamp.substr(0, 10);
        },
      },
      ],
      order: [[3, "desc"]],
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

  const menuItems = document.querySelectorAll(".menu");

  menuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", function () {
      const menuTitle = this.textContent.trim();
      const logData = `Clicked menu: ${menuTitle}`;

      SaveLog(logData);
    });
  });
});

function SaveLog(logData) {
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));

  const timeStamp = getDateTime();

  const data = {
    id: 0,
    accountId: decodedtoken.AccountId,
    name: decodedtoken.Name,
    activity: logData,
    timeStamp: timeStamp,
  };

  fetch("https://localhost:7177/api/HistoryLog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //'Authorization': 'Bearer access_token_here'
    },
    body: JSON.stringify(data),
  });
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function SaveLogUpdate(activity) {
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));

  const timeStamp = getDateTime();
  const data = {
    id: 0,
    accountId: decodedtoken.AccountId,
    name: decodedtoken.Name,
    activity: activity,
    timeStamp: timeStamp,
  };

  fetch("https://localhost:7177/api/HistoryLog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //'Authorization': 'Bearer access_token_here'
    },
    body: JSON.stringify(data),
  });
}

function getDateTime() {
  var timeNow = new Date().toISOString();
  var timeStamp =
    timeNow.substr(0, 11) +
    new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Jakarta",
      hour12: false,
    });

  return timeStamp;
}
