var dataEmployee = [];
var dataEmployeeCV = [];

var notification = document.getElementById("notification");
var element = document.getElementById("btnBell");
var elementAlert = document.getElementById("alertNotif");
$(document).ready(function () {
  fetchContractPlacement();
});
function clearScreen() {
  $("#accountId").val("");
  $("#currentPassword").val("");
  //$('#Location').val('');
  $("#newPassword").val("");
  $("#repeatPassword").val("");

  $("input[required]").each(function () {
    var input = $(this);

    input.next(".error-message").hide();
  });
}

function updatePassword() {
  var isValid = true;

  $("input[req]").each(function () {
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

  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accountId = decodedtoken.AccountId;
  const email = decodedtoken.Email;

  var currentPassword = document.getElementById("currentPassword").value;
  var newPassword = document.getElementById("newPassword").value;
  var repeatPassword = document.getElementById("repeatPassword").value;

  //Validasi 6 Karakter Change Password
  if (newPassword.length < 6 || repeatPassword.length < 6) {
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: "Password must be more than 6 characters",
    });

    return; // Hentikan eksekusi lebih lanjut
  }
  //End Validasi 6 Karakter
  if (newPassword != repeatPassword) {
    // Password dan repeat password tidak sama, tampilkan pesan error

    Swal.fire({
      icon: "error",
      title: "Failed",
      text: "Password and Repeat Password do not match.",
    });
    return; // Hentikan eksekusi lebih lanjut
  }

  fetch("https://localhost:7177/api/Accounts/ChangePassword", {
    method: "PUT", // Atur metode sesuai kebutuhan
    headers: {
      "Content-Type": "application/json", // Atur tipe konten sesuai kebutuhan
      // Atur header lain yang diperlukan, seperti token
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    body: JSON.stringify({
      email: email,
      currentPassword: currentPassword,
      newPassword: newPassword,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Password has been updated successfully!",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        if (decodedtoken.RoleId == "2") {
          SaveLog_(decodedtoken);
        }

        $("#changePasswordModal").modal("hide");
        location.reload();
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to update password. Please check your current password.",
      });
      // Tampilkan pesan error jika terjadi kesalahan
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

function togglePasswordVisibility(inputId) {
  var icon = $("#" + inputId)
    .nextAll(".password-toggle-icon")
    .find("i");
  var input = $("#" + inputId);

  if (input.attr("type") === "password") {
    input.attr("type", "text");
    icon.removeClass("fa-eye").addClass("fa-eye-slash");
  } else {
    input.attr("type", "password");
    icon.removeClass("fa-eye-slash").addClass("fa-eye");
  }
}

function SaveLog_(logData) {
  //debugger;

  const data_ = {
    id: 0,
    accountId: logData.AccountId,
    name: logData.Name,
    activity: "Has Change Password",
    timeStamp: new Date().toISOString(),
  };

  fetch("https://localhost:7177/api/HistoryLog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //'Authorization': 'Bearer access_token_here'
    },
    body: JSON.stringify(data_),
  });
}

function fetchContractPlacement() {
  fetch("https://localhost:7177/api/Employees", {
    method: "GET",
    datatype: "json",
    dataSrc: "data",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  })
    .then((response) => response.json())
    .then((result) => {
      var notificationDate = [];
      result.data.forEach(function (emp) {
        if (emp.placements.length > 0) {
          var endContract = new Date(emp.endContract);
          var endPlacement = new Date(
            emp.placements[emp.placements.length - 1].endDate
          );

          var today = new Date();
          var timeDiff = today.getTime() - endPlacement; // Menghitung selisih dalam milidetik
          var daysremain = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Menghitung selisih dalam hari dan membulatkannya
          var daysremainPositive = Math.abs(daysremain);
          if (daysremainPositive <= 30) {
            endPlacement.setDate(endPlacement.getDate() - 30);
            notificationDate.push(endPlacement);
            var data = {
              accountId: emp.accountId,
              fullname: emp.fullname,
              placement: emp.placements[emp.placements.length - 1].companyName,
              days: daysremain,
              date: endPlacement.toLocaleDateString(),
            };
            dataEmployee.push(data);
          }
        }
      });

      dataEmployee.forEach(function (notif) {
        notification.innerHTML += `
        <a class="dropdown-item d-flex align-items-center notification-item" href="/ManageEmployee/DetailEmployee?accountId=${notif.accountId}">
          <div class="mr-3">
            <div class="icon-circle bg-primary">
              <i class="fas fa-file-alt text-white"></i>
            </div>
          </div>
          <div>
          <div class="small text-gray-500">Reminder &nbsp;<span class="badge-lg badge-pill badge-success">${notif.date}</span></div>
            <b>${notif.fullname}</b> contract at <b>${notif.placement}</b> is less than a month.
          </div>
        </a>`;
      });
    })
    .then(() => {
      checkOverviewEmployee();
    });
}

function checkOverviewEmployee() {
  fetch("https://localhost:7177/api/Employees/CheckOverviewEmployee", {
    method: "GET",
    datatype: "json",
    dataSrc: "data",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  })
    .then((response) => response.json())
    .then((result) => {
      result.data.forEach(function (emp) {
        if (
          //Check Personal Detail
          emp.fullname == null ||
          emp.nickname == null ||
          emp.birthplace == null ||
          emp.birthdate == null ||
          emp.religion == null ||
          emp.gender == null ||
          emp.maritalstatus == null ||
          emp.nationality == null ||
          emp.address == null ||
          //Check Education
          emp.formalEdus.length == 0 ||
          emp.nonFormalEdus.length == 0 ||
          //Check Qualifications
          emp.qualifications.framework == null ||
          emp.qualifications.programmingLanguage == null ||
          emp.qualifications.database == null ||
          //Check Certificate
          emp.certificates.length == 0 ||
          //Check Employeement History
          emp.employmentHistories.length == 0 ||
          //Check Project History
          emp.projectHistories.length == 0
        ) {
          dataEmployeeCV.push(`${emp.fullname} data is still incomplete.`);
        }
        // console.log(dataEmployee);
      });

      dataEmployeeCV.forEach(function (notif) {
        notification.innerHTML += `
        <div class="dropdown-item d-flex align-items-center notification-item">
          <div class="mr-3">
            <div class="icon-circle bg-warning">
              <i class="fas fa-user text-white"></i>
            </div>
          </div>
          <div>
          <div class="small text-gray-500">CV Employee - ${new Date().toLocaleDateString()}</div>
            ${notif}
          </div>
        </div>`;
      });
      var notifLength = dataEmployee.length + dataEmployeeCV.length;
      $("#noNotif").hide();
      document.getElementById("notifCount").innerHTML = notifLength;
       
    });
}



