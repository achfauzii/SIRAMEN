$(document).ready(function () {
  const menuItems = document.querySelectorAll(".menu");

  menuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", function () {
      const menuTitle = this.textContent.trim();
      const logData = `Clicked menu: ${menuTitle}`;

      SaveLog(logData); // Panggil fungsi untuk menyimpan log
    });
  });
});

function SaveLog(logData) {
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));

  var timeNow = new Date().toISOString();
  var timeStamp =
    timeNow.substr(0, 11) +
    new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Jakarta",
      hour12: false,
    });

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
