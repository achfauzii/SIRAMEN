$(document).ready(function () {
  $("#reportbutton").on("click", function(){
  $("#to-show").toggleClass("d-none");
  })

  $("#loginForm").on("submit", async function (event) {
    event.preventDefault();
    $("#loader").show();
    const url = "https://localhost:7177/api/Accounts";
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
          });

          const getValueByIndex = (obj, index) => obj[Object.keys(obj)[index]];
          var Role = getValueByIndex(decodedToken, 8);
          if (Role === "Admin" || Role=="Trainer" || Role=="Manager" || Role=="Sales") {
            SaveLog(decodedToken);
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
function SaveLog(logData) {
    var timeNow = new Date().toISOString();
    var timeStamp = getTime();
    const data = {
        id: 0,
        accountId: logData.AccountId,
        name: logData.Name,
        activity: "Has Log In",
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
function Logout() {
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const timeStamp = getTime();
    if (decodedtoken.RoleId == "2") {
        const data = {
            id: 0,
            accountId: decodedtoken.AccountId,
            name: decodedtoken.Name,
            activity: "Has Log Out",
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

    sessionStorage.removeItem("Token"); //Remove Session
    window.location.href = "https://localhost:7109/"; //Kembali Ke halaman Awal
}

function getTime() {
    var timeNow = new Date().toISOString();
    var timeStamp =
        timeNow.substr(0, 11) +
        new Date().toLocaleTimeString("en-US", {
            timeZone: "Asia/Jakarta",
            hour12: false,
        });

    return timeStamp;
}

function kirimPengaduan() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });


  const userInfo = getUserNameEmail()

  const data = {
    email: userInfo ? userInfo.email : $("#email").val(),
    name: userInfo ? userInfo.name : $("#name").val(),
    message: $("#description").val(),
  };

  console.log(data);

  $.ajax({
    type: "POST",
    url: "/Announce/SendEmailPengaduan",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(data),

    beforeSend: function () {
      $("#loader").show();
    },
    complete: function () {
      $("#loader").hide();
    },

    success: function (d) {
      $("#email").val("");
      $("#name").val("");
      $("#description").val("");
      Toast.fire({
        icon: "success",
        text: "The complaint has been successfully reported.",
      });
    },
    failed: function (er) {
      console.log("Error : " + er.message);
    },
  });
}
function getUserNameEmail() {
  var token = sessionStorage.getItem("Token");
  if (token) {
      var base64Url = token.split(".")[1];
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var payload = JSON.parse(atob(base64));

      return {
        name: payload.Name,
        email: payload.Email
      };
  }

  return null;
}