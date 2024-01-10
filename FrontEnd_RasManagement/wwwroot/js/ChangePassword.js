$(document).ready(function () {
  fetchContractInfo();
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

function fetchContractInfo() {
  var dataEmployee = [];
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
      result.data.forEach(function (emp) {
        if (emp.placements.length > 0) {
          var endContract = new Date(emp.endContract);
          var endPlacement = new Date(
            emp.placements[emp.placements.length - 1].endDate
          );

          var timeDiff = endContract.getTime() - endPlacement; // Menghitung selisih dalam milidetik
          var daysremain = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Menghitung selisih dalam hari dan membulatkannya

          if (daysremain < 30) {
            var data = {
              accountId: emp.accountId,
              fullname: emp.fullname,
              placement: emp.placements[emp.placements.length - 1].companyName,
              days: daysremain,
            };
            dataEmployee.push(data);
          }
          console.log(daysremain);
        }
      });

      var notification = document.getElementById("notification");
      dataEmployee.forEach(function (notif) {
        notification.innerHTML += `
        <a class="dropdown-item d-flex align-items-center" href="/ManageEmployee/DetailEmployee?accountId=${notif.accountId}">
          <div class="mr-3">
            <div class="icon-circle bg-primary">
              <i class="fas fa-file-alt text-white"></i>
            </div>
          </div>
          <div>
          <div class="small text-gray-500">Reminder</div>        
            The expiry date for <b>${notif.fullname}</b> placement at <b>${notif.placement}</b> is approaching, with <b>${notif.days}</b> days remaining on the contract.
          </div>
        </a>`;
      });
      if (dataEmployee.length == 0) {
        $("#noNotif").show();
        $("#notifCount").hide();
      } else {
        $("#noNotif").hide();
        document.getElementById("notifCount").innerHTML = dataEmployee.length;
      }
    });
}
