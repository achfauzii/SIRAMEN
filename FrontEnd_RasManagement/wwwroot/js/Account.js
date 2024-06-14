// Account.js ini secara garis besar menangani berbagai macam interaksi yang ada pada halaman login
// Melakukan Login, dan mengirim pengaduan yang ada pada form pengaduan

$(document).ready(function () {

    // Handle Button Report pada halaman login
    $("#reportbutton").on("click", function () {

        $("#to-show").toggleClass("d-none");
        $("#help-text").toggleClass("d-none");
  })

  //Form login Submit dan redirect ke halaman dashboard berdasarkan role
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
        // Jika berhasil login token di disimpan ke dalam local storage, dan dapat digunakan dengan menggunakan getItem Token tersebut
        localStorage.setItem("Token", token);
        sessionStorage.setItem("Token", token);

        //variabel decode token, yang berisi sebuah token JWT yang sudah di pisah, dengan menggunakan function pasreJwt(token)
        var decodedToken = parseJwt(token);

        
        // Jika berhasil login, akan mengirim token ke controller AccountsController function Auth pada FE
        // Tujuannya untuk menyimpan token ke dalam Session controller pada .NET
        $.post("/Accounts/Auth", { token }).done(function () {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });

         // Mengambil Role pada token yang didapat
            const getValueByIndex = (obj, index) => obj[Object.keys(obj)[index]];
         // Dengan memanggil function getValueByIndex untuk mendapatkan role yang ada pada array ke 8 yang berisi Role tersebut
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

        Toastify({
          text: "Incorrect email or password !",

          duration: 3000,
          style: {
            background: "#DC3545",
          },
        }).showToast();
      }
    } catch (error) {
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


// Function untuk handel show password pada form login 
function showPassword() {
    let temp = document.getElementById("exampleInputPassword");

    if (temp.type === "password") {
        temp.type = "text";
    } else {
        temp.type = "password";
    }
}

// Function untuk melakukan parse pada Token JWT, memisah token menjadi beberapa bagian untuk di gunakan di function lainnya
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

// Function untuk menyimpan activity yang dilakukan kedalam tabel History Log Login
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


// Function untuk logout
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
    localStorage.removeItem("Token");
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

// Function ini untuk menangani form pengaduan yang ada pada halaman login
function kirimPengaduan() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  var valid = true;
    $("input[required-report],textarea[required-report]").each(function () {
    var input = $(this);

    
    if (input.attr("type") === "email" && !isValidEmail(input.val())) {
      input.addClass("is-invalid");
      valid = false;
    }else {
      input.removeClass("is-invalid");
    }
    if (!input.val()) {
      input.addClass("is-invalid");
      valid = false;
    }
  });

  if (!valid) {
    return;
  }
  
  const userInfo = getUserNameEmail()

  const data = {
    email: userInfo ? userInfo.email : $("#email").val(),
    name: userInfo ? userInfo.name : $("#name").val(),
    message: $("#description").val(),
  };

 // Jika telah melwati validasi di atas dan di set data nya,
 // kemudian akan emngirim ke controller 'Announce Controller' function SendEmailPengaduan untuk proses pengiriman email
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

// functionn checking email valid
function isValidEmail(email) {
  // Use a regular expression for basic email validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.endsWith("@berca.co.id");
}

// Function unutk mendapatkan username dan email
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


function closeHelpText() {
    $("#containerHelpText").hide();
}