$(document).ready(function () {
    //changePassword;
})
function clearScreen() {

    $('#accountId').val('');
    $('#currentPassword').val('');
    //$('#Location').val('');
    $('#newPassword').val('');
    $('#repeatPassword').val('');

    $('input[required]').each(function () {
        var input = $(this);

        input.next('.error-message').hide();

    });
}



function updatePassword() {
 
    var isValid = true;

    $('input[req]').each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next('.error-message').show();
            isValid = false;
        } else {
            input.next('.error-message').hide();
        }
    });

    if (!isValid) {
        return;
    }

    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accountId = decodedtoken.AccountId;
    const email = decodedtoken.Email;
    var currentPassword = document.getElementById('currentPassword').value;
    var newPassword = document.getElementById('newPassword').value;
    var repeatPassword = document.getElementById('repeatPassword').value;


    if (newPassword != repeatPassword) {
        // Password dan repeat password tidak sama, tampilkan pesan error
        alert('Password and Repeat Password do not match.');
        return; // Hentikan eksekusi lebih lanjut
    }
    debugger;
    fetch('https://localhost:7177/api/Accounts/AccountId?accountId='+accountId, {
        method: 'GET', // Atur metode sesuai kebutuhan

        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
 
    })
        .then(response => response.json())
        .then(data => {
            // Lakukan sesuatu dengan data yang diterima
            console.log(currentPassword);
            if (data.data.password !== currentPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: 'Failed to update password. Please check your current password.',
                 
                })
                return; 
            }

            fetch('https://localhost:7177/api/Accounts/UpdatePassword', {
                method: 'PUT', // Atur metode sesuai kebutuhan
                headers: {
                    'Content-Type': 'application/json', // Atur tipe konten sesuai kebutuhan
                    // Atur header lain yang diperlukan, seperti token
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: newPassword
                })
            })
                .then(response => response.json())
                .then(data => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Password has been updated successfully!',
                        showConfirmButton: false,
                        timer: 2000
                    }).then(() => {
                        $('#changePasswordModal').modal('hide');
                        location.reload();
                    });
                })
                .catch(error => {
                    console.error('Error updating password:', error);
                    // Tampilkan pesan error jika terjadi kesalahan
                });



            
        })
        .catch(error => {
            console.error('Error fetching specific data:', error);
            // Tampilkan pesan error jika terjadi kesalahan
        });


   

}


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}