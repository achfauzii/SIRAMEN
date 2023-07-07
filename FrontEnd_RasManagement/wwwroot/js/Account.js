document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const url = "http://localhost:8003/api/Account";
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

    // Tampilkan loader
    const loaderContainer = document.getElementById("loaderContainer");
    loaderContainer.innerHTML = ""; // Bersihkan konten sebelumnya

    // Loader
    const loaderResponse = await fetch("/loader/index");
    const loaderHtml = await loaderResponse.text();

    loaderContainer.insertAdjacentHTML("beforeend", loaderHtml);


    debugger;
    try {
        const response = await fetch(url, option);
        const json = await response.json();

        if (response.ok) {
            sessionStorage.setItem("userToken", json.data);
            const decodedToken = jwt_decode(sessionStorage.getItem("userToken"));

            console.log("Token : " + sessionStorage.getItem("userToken"));
            console.log(response);
            console.log(decodedToken.Role);
            debugger;

            loaderContainer.innerHTML = "";

            Swal.fire({
                icon: 'success',
                title: 'Greats...',
                text: 'You are signed in :D',
                showConfirmButton: false,
                timer: 1000,
                didClose: () => {
                    window.location.replace("/testrole/index");
                }
            });
        } else {
            loaderContainer.innerHTML = "";

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong',
                showConfirmButton: false,
                timer: 1000,
                didClose: () => {
                    window.location.replace("/login/index");
                }
            });
        }
    } catch (error) {
        loaderContainer.innerHTML = "";

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong',
            showConfirmButton: false,
            timer: 1000,
            didClose: () => {
                window.location.replace("/login/index");
            }
        });
    }
});