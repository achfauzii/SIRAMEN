$(document).ready(function () {
    //debugger;
    // Mendapatkan nilai parameter accountId dari URL
    loadDataA();
});

function loadDataA() {
    var urlParams = new URLSearchParams(window.location.search);
    var accountId = urlParams.get('accountId');
    $.ajax({
        url: "https://localhost:7177/api/Employees/accountId?accountId=1",
        //url: "https://localhost:7177/api/Employees/accountId?accountId=${accountId}",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            debugger;
            console.log(result); 
            var obj = result.data.result; //data yg didapat dari api
            var birthDate = obj.birthdate;
            const date = new Date(birthDate);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const date_ = date.toLocaleDateString('id-ID', options);
            document.getElementById('nickName').textContent = obj.nickname;
            document.getElementById('birthPlace').textContent = obj.birthplace;
            document.getElementById('birthDate').textContent = date_;
            document.getElementById('gender').textContent = obj.gender;
            document.getElementById('religion').textContent = obj.religion;
            document.getElementById('martialStatus').textContent = obj.maritalstatus;
            document.getElementById('nationality').textContent = obj.nationality;

            // Menampilkan foto jika tersedia, atau kotak foto jika tidak
            var imageContainer = document.getElementById('imageContainer');
            if (obj.image) {
                var imgElement = document.createElement('img');
                imgElement.src = obj.image;
                imgElement.style.height = '100px';
                imgElement.style.width = '100px';
                imgElement.alt = 'Profile Picture';
                imageContainer.appendChild(imgElement);
            } else {
                var defaultImageBox = document.createElement('div');
                defaultImageBox.style.height = '100px';
                defaultImageBox.style.width = '100px';
                defaultImageBox.style.border = '1px solid #ccc';
                defaultImageBox.style.backgroundColor = '#f1f1f1';
                imageContainer.appendChild(defaultImageBox);
            }

        },
        error: function (errormessage) { alert(errormessage.responseText); }
    });
}



/*// Fungsi untuk mendapatkan data dari API
async function getDataFromAPI(accountId) {
    try {
        const response = await fetch('https://localhost:7177/api/Employees/accountId?accountId=${accountId}');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// Fungsi untuk mengisi nilai-nilai di dalam HTML
async function fillPersonalDetails() {
    debugger;
    // Ganti 'accountId' dengan nilai yang sesuai, misalnya id karyawan
    const accountId = 'accountId';
    const personalDetails = await getDataFromAPI(accountId);

    if (personalDetails) {
        document.getElementById("nickName").innerText = personalDetails.nickname;
        document.getElementById("birthPlace").innerText = personalDetails.birthplace;
        document.getElementById("birthDate").innerText = personalDetails.birthdate;
        document.getElementById("gender").innerText = personalDetails.gender;
        document.getElementById("religion").innerText = personalDetails.religion;
        document.getElementById("martialStatus").innerText = personalDetails.maritalstatus;
        document.getElementById("nationality").innerText = personalDetails.nationality;

        // Tampilkan foto jika tersedia, atau kotak foto jika tidak
        const imageContainer = document.getElementById("imageContainer");
        if (personalDetails.photoUrl) {
            const imgElement = document.createElement("img");
            imgElement.src = personalDetails.photoUrl;
            imgElement.style.height = "100px";
            imgElement.style.width = "100px";
            imgElement.alt = "Profile Picture";
            imageContainer.appendChild(imgElement);
        } else {
            const defaultImageBox = document.createElement("div");
            defaultImageBox.style.height = "100px";
            defaultImageBox.style.width = "100px";
            defaultImageBox.style.border = "1px solid #ccc";
            defaultImageBox.style.backgroundColor = "#f1f1f1";
            imageContainer.appendChild(defaultImageBox);
        }
    }
}

// Panggil fungsi untuk mengisi nilai-nilai pada saat halaman dimuat
fillPersonalDetails();
*/

