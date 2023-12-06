document
  .getElementById("resetPassword")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    var resetPassword = new Object(); //object baru
    resetPassword.email = document.getElementById("email").value;
    resetPassword.newPassword = document.getElementById("password").value;
    var repeatPassword = document.getElementById("repeatPassword").value;
    if (resetPassword.newPassword != repeatPassword) {
      // Password dan repeat password tidak sama, tampilkan pesan error
  
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Password and Repeat Password do not match.",
      });
      return; // Hentikan eksekusi lebih lanjut
    }
    //Validasi 6 Karakter Change Password
    if (resetPassword.newPassword.length < 6 || repeatPassword.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Password must be more than 6 characters",
      });

      return; // Hentikan eksekusi lebih lanjut
    }
    if (resetPassword.newPassword !== repeatPassword) {
      // Password dan repeat password tidak sama, tampilkan pesan error
      Swal.fire({
        icon: "error",
        title: "Failed...",
        text: "Password reset failed.",
      });
      return; // Hentikan eksekusi lebih lanjut
    }

    $.ajax({
      type: "PUT",
      url: "https://localhost:7177/api/Accounts/UpdatePassword",
      data: JSON.stringify(resetPassword),
      contentType: "application/json; charset=utf-8",
      /*headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("tokenJWT")
        },*/
    }).then((result) => {
      //debugger;
      if (result.status == 200) {
        Swal.fire({
          icon: "success",
          title: "Success...",
          text: "Password reset successfully.",
        }).then(() => {
          // After the user clicks "OK" on the SweetAlert, redirect to the desired location
          window.location.replace("/Accounts/Login");
        });
      } else {
        // If result.status is not 200 (indicating failure)
        Swal.fire({
          icon: "error",
          title: "Failed...",
          text: "Password reset failed.",
        });
      }
    });
  });


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