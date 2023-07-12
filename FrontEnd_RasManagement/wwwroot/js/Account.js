document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const url = "https://localhost:7177/api/Accounts";
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
        console.log(json.data);
        if (response.ok) {
            var token = json.data;
            sessionStorage.setItem("Token", token);
            const decodedToken = parseJwt(json.data);


            console.log(decodedToken.Role);
            //debugger;

            //loaderContainer.innerHTML = "";

            $.post("/Accounts/Auth", { token })

                .done(function () {
                    Swal.fire({
                        icon: 'success',
                        title: 'Greats...',
                        text: 'You are signed in :D',
                        showConfirmButton: false,
                        timer: 1000,
                        didClose: () => {
                            if (decodedToken.Role === 'Admin') {
                                window.location.replace("/dashboards/dashboard_admin"); // Redirect to admin dashboard
                            } else {
                                window.location.replace("/dashboards/employee"); // Redirect to user dashboard
                            }

                            Toastify({
                                text: "Hi " + decodedToken.Nama,
                                duration: 3000,
                                style: {
                                    background: "#28a745",
                                },
                            }).showToast();
                        }
                    })
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



function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));


    return JSON.parse(jsonPayload);
}