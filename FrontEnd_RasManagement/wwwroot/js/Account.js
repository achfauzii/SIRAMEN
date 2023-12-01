$(document).ready(function () {
  $("#loginForm").on("submit", async function (event) {
    event.preventDefault();
    $("#loader").show();
    const url = "http://202.69.99.67:9001/api/Accounts";
    const data = {
      email: $("#exampleInputEmail").val(),
      password: $("#exampleInputPassword").val(),
    };
    const option = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, option);
      const json = await response.json();

      if (response.ok) {
        var token = json.data;
        sessionStorage.setItem("Token", token);
        var decodedToken = parseJwt(token);

        //loaderContainer.innerHTML = "";

        $.post("/Accounts/Auth", { token }).done(function () {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          const getValueByIndex = (obj, index) => obj[Object.keys(obj)[index]];
          var Role = getValueByIndex(decodedToken, 8);
          if (Role === "Admin") {
            Toast.fire({
              icon: "success",
              title: "Signed in successfully",
              text: "Hi " + decodedToken.Name,
              didClose: () => {
                window.location.replace("/dashboards/dashboard_admin");
              },
            });
          } else if (Role === "Super_Admin") {
            Toast.fire({
              icon: "success",
              title: "Signed in successfully",
              text: "Hi " + decodedToken.Name,
              didClose: () => {
                window.location.replace("/dashboards/dashboard_superadmin");
              },
            });
          } else if (Role === "Employee") {
            Toast.fire({
              icon: "success",
              title: "Signed in successfully",
              text: "Hi " + decodedToken.Name,
              didClose: () => {
                window.location.replace("/Dashboards/Employee"); // Redirect to user dashboard
              },
            });
          } else {
            Swal.fire({
              icon: "warning",
              title: "Failed Login",
              text: "Your Account Has Ben Suspended",
              showConfirmButtom: false,
              timer: 1500,
            });
          }
        });
      } else if (response.status == 400) {
        Swal.fire({
          icon: "warning",
          title: "Failed Login",
          text: "Your Account Has Ben Suspended",
          showConfirmButtom: false,
        });
      } else {
        // loaderContainer.innerHTML = "";

        Toastify({
          text: "Incorrect email or password !",

          duration: 3000,
          style: {
            background: "#DC3545",
          },
        }).showToast();
      }
    } catch (error) {
      //loaderContainer.innerHTML = "";

      Toastify({
        text: "Incorrect email or password !",

        duration: 3000,
        style: {
          background: "#DC3545",
        },
      }).showToast();
    }
    $("#loader").hide();
  });
});

function showPassword() {
  let temp = document.getElementById("exampleInputPassword");

  if (temp.type === "password") {
    temp.type = "text";
  } else {
    temp.type = "password";
  }
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

function Logout() {
  sessionStorage.removeItem("Token"); //Remove Session
  window.location.href = "http://202.69.99.67:9005/"; //Kembali Ke halaman Awal
}
