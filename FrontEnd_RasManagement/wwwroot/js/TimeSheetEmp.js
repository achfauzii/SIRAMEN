$(document).ready(function () {
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    $.ajax({
        url: "https://localhost:7177/api/Employees/accountId?accountId="+accid,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var obj = result.data.result; 
            
            $('#fullName').text(obj.fullname);
         
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
    //Get CompanyName (Placement)
    $.ajax({
        url: "https://localhost:7177/api/EmployeePlacements/accountId?accountId=" + accid,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var obj = result.data;
            var obj = result.data;
            if (obj && obj.length > 0) {
                var lastData = obj[0];
                $('#compName').text(lastData.companyName);
            } else {
                console.log('Tidak ada data');
            }
           
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
})


function save() {
    // Ganti URL_target dengan URL endpoint API yang sesuai
    const apiUrl = 'URL_target';

    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            console.log('Data saved:', result);
            // Lakukan sesuatu jika data berhasil disimpan
            return result; // Mengembalikan hasil jika diperlukan
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            // Lakukan sesuatu jika ada kesalahan dalam menyimpan data
            throw error; // Melempar kembali kesalahan jika diperlukan
        });
}

function clearScreen() {
    $("#activity").val("");
    document.getElementById('flag').selectedIndex = 0;
    document.getElementById('category').selectedIndex = 0;
    document.getElementById('status').selectedIndex = 0;
    $("#knownBy").val("");
    
    $("#Update").hide();
    $("#Save").show();

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
