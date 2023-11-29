
document.getElementById("resetPassword").addEventListener("submit", async function (event) {
    event.preventDefault();
    var resetPassword = new Object(); //object baru
    resetPassword.email = document.getElementById('email').value;
    resetPassword.newPassword = document.getElementById('password').value;
   var repeatPassword = document.getElementById('repeatPassword').value;

    if (resetPassword.newPassword !== repeatPassword) {
        // Password dan repeat password tidak sama, tampilkan pesan error
        alert('Password and Repeat Password do not match.');
        return; // Hentikan eksekusi lebih lanjut
    }
 
    $.ajax({
        type: 'PUT',
        url: 'http://192.168.25.243:9001/api/Accounts/UpdatePassword',
        data: JSON.stringify(resetPassword),
        contentType: "application/json; charset=utf-8"
        /*headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("tokenJWT")
        },*/
    }).then(result => {
        //debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Password reset successfully.',
                showConfirmButtom: false,
                timer: 10000
            })
            window.location.replace("/Accounts/Login");
        }
        else {
            alert("Forgot Password Failed");
        }
    });

});