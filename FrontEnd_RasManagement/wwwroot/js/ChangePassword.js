// ChangePassord.js ini menangani seluruh sisi dari admin hingga employee dalam mengganti password
// dan terdapat function save log untuk menyimpan log pergantian password hanya untuk admin
// Untuk melakukan change password ini tombol ada ketika di klik nama pada bagian navbar kemudian muncul change password
var dataEmployee = [];
var dataEmployeeCV = [];

var roleId = getUserRole();
var notification = document.getElementById("notification");
var element = document.getElementById("btnBell");
var elementAlert = document.getElementById("alertNotif");

// Kondisi untuk hide tombol lonceng yang ada pada navbar yang roleId == 1 (Super Admin) atau roleId == 3 (Employee)
if (roleId == 1 || roleId == 3) {
    debugger;
  $("#btnBell").hide();
}


// Function ini digunakan untuk membersihkan value inputan password saat melakukan penggantian password
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

// Function ini akan di jalankan ketika pengguna mengklik tombol Save Changes pada form Change Password
// Terdapat validasi minimal 6 karakter, dan validasi required.
// Function ini mengandung api yang dilakukan untuk update password, dengan data yang dibutuhkan adalah
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

// Untuk data yang diperlukan adalah sebagi berikut
// Email dan account Id yang di dapat dari token dari setiap user yang telah melakukan login
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

// Pengecekan newPassword dan repeat password
  if (newPassword != repeatPassword) {
    // Password dan repeat password tidak sama, tampilkan pesan error

    Swal.fire({
      icon: "error",
      title: "Failed",
      text: "Your new password doesn't match.",
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


// Function untuk melakukan parse Token JWT yang digunakan untuk menadpat kan email, account id, dan role
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

// Function ini untuk menangani show dan hide password saat melakukan pergantian password
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


// Functuion ini digunakan untuk melakukan penyimpana History Log kedalam server 
// untuk menyimoan aktivitas pergantian password Admin
function SaveLog_(logData) {
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

    },
    body: JSON.stringify(data_),
  });
}


function showAllNotification() {
  var notifLength = dataEmployee.length + dataEmployeeCV.length;
  var notifItem = document.getElementsByClassName("notification-item");
  $("#showAllNotif").hide();
  $("#hideAllNotif").show();

  for (let i = notifLength; i > 3; i--) {
    notifItem[i - 1].classList.add("d-flex");
 
  }

  $("#btnBell").trigger("click");
  $("#btnBell").classList.add("show");
  $("#alertNotif").classList.add("show");
}

function hideAllNotification() {
  var notifLength = dataEmployee.length + dataEmployeeCV.length;
  var notifItem = document.getElementsByClassName("notification-item");
  $("#hideAllNotif").hide();
  $("#showAllNotif").show();

  for (let i = notifLength; i > 3; i--) {
    notifItem[i - 1].classList.remove("d-flex");
    notifItem[i - 1].classList.add("d-none");
  }

  $("#btnBell").trigger("click");
  $("#btnBell").classList.add("show");
  $("#alertNotif").classList.add("show");
}


function getUserRole() {
  var token = sessionStorage.getItem("Token");
  if (token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var payload = JSON.parse(atob(base64));

    return parseInt(payload.RoleId, 10);
  }

  return null;
}
