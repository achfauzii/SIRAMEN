$(document).ready(function () {
    $("#loginForm").on("submit", async function (event) {
        event.preventDefault();
        const url = "https://rasmanagement-001-site1.atempurl.com/api/Accounts";
        const data = {
            email: $('#exampleInputEmail').val(),
            password: $('#exampleInputPassword').val()
        };
        const option = {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify(data)
        };


        /*    // Tampilkan loader
            const loaderContainer = document.getElementById("loaderContainer");
            loaderContainer.innerHTML = ""; // Bersihkan konten sebelumnya
        
            // Loader
            const loaderResponse = await fetch("/loader/index");
            const loaderHtml = await loaderResponse.text();
        
            loaderContainer.insertAdjacentHTML("beforeend", loaderHtml);
        */


        //debugger;
        try {
            const response = await fetch(url, option);
            const json = await response.json();

            if (response.ok) {
                var token = json.data;
                sessionStorage.setItem("Token", token);
                var decodedToken = parseJwt(token);

                //loaderContainer.innerHTML = "";

                $.post("/Accounts/Auth", { token })
                    .done(function () {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })




                        const getValueByIndex = (obj, index) => obj[Object.keys(obj)[index]];
                        var Role = getValueByIndex(decodedToken, 8);
                        if (Role === 'Admin') {
                            Toast.fire({
                                icon: 'success',
                                title: 'Signed in successfully',
                                text: "Hi " + decodedToken.Name,
                                didClose: () => {
                                    window.location.replace("/Dashboards/Dashboard_Admin");
                                }
                            })
                        } else if (Role === 'Super_Admin') {
                            Toast.fire({
                                icon: 'success',
                                title: 'Signed in successfully',
                                text: "Hi " + decodedToken.Name,
                                didClose: () => {
                                    window.location.replace("/Dashboards/Dashboard_Superadmin")
                                }
                            })
                           
                        } else if (Role === 'Employee') {
                            Toast.fire({
                                icon: 'success',
                                title: 'Signed in successfully',
                                text: "Hi " + decodedToken.Name,
                                didClose: () => {
                                    window.location.replace("/Dashboards/Employee"); // Redirect to user dashboard
                                }
                            })
                           
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title:'Failed Login',
                                text: 'Your Account Has Ben Suspended',
                                showConfirmButtom: false,
                                timer: 1500
                            })
                        }


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
    });
});



function showPassword() {
    let temp = document.getElementById("exampleInputPassword");

    if (temp.type === "password") {
        temp.type = "text";
    }
    else {
        temp.type = "password";
    }
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));


    return JSON.parse(jsonPayload);
}

function Logout() {
    sessionStorage.removeItem('Token'); //Remove Session
    window.location.href = 'http://rasmanagement2-001-site1.etempurl.com/'; //Kembali Ke halaman Awal 

}