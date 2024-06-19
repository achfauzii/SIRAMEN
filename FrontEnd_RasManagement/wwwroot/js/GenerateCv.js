//GenerateCV.js ini digunakan untuk Generate CV Employee
//Halaman yang menggunakan file GenerateCV.js yaitu pada Generate CV Employee dan Table Manage Resource -> icon Pdf pada Admin
//GenerateCV.js ini dijalankan ketika admin atau employee mengklik tombol generate CV
//Kemudian akan menampilkan data2 Employee dalam bentuk CV Berca dan dapat di download
//File CSHTML yang digunakan adalah GenerateCV -> Index untuk admin, untuk employee generateCV -> generateCVEmployee

$(document).ready(function () {
    // Mendapatkan nilai parameter accountId dari URL
    $("#backButton").on("click", function () {
        window.location.href = "/ManageEmployee/Index"; // Go back to the previous page
    });
    loadData();
});

// Function loadData ini digunakan untk load dan menampilan Data CV yang didapat dari server berdasarkan Account Id
// Terdapat beberapa data yang di get yaitu Data Account, FormalEducation, Non Formal Edu, Qualifiaction, Employeement History, Certificate, dan project History
// Pada Function ini juga memanggil function Shufle Array yang digunakan untuk mengacak nilai Non Formal Education untuk employee bootcamp
// Masing2 data ditampilkan dalam format cv berca disini
function loadData() {
    $("#loader").show();

    var userRole = getUserRole();
    var accountId;

    if (userRole === 3) {
        accountId = getAccountIdFromToken();
    } else {
        var urlParams = new URLSearchParams(window.location.search);
        accountId = urlParams.get("accountId");
    }

    //Get data Employee berdasarkan Account Id
    //Kemudian ditampilkan dalam bentuk Format CV Berca dengan mengisi text content pada cshtml 
    $.ajax({
        url:
            "https://localhost:7177/api/Employees/accountId?accountId=" +
            accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            var obj = result.data.result; // Data yang diterima dari API
            var birthDate = obj.birthdate;

            var date_ = "";
            if (birthDate != null) {
                const date = new Date(birthDate);
                const options = { day: "numeric", month: "long", year: "numeric" };
                date_ = date.toLocaleDateString("id-ID", options);
            } else {
                date_ = "";
            }
            //Mengisi content2 Cshtml berdasarkan ID
            document.getElementById("fullName").textContent = obj.fullname;
            document.getElementById("nickName").textContent = obj.nickname;
            document.getElementById("birthPlace").textContent = obj.birthplace + ", ";
            document.getElementById("birthDate").textContent = date_;
            document.getElementById("gender").textContent = obj.gender;
            document.getElementById("religion").textContent = obj.religion;
            document.getElementById("martialStatus").textContent = obj.maritalstatus;
            document.getElementById("nationality").textContent = obj.nationality;


            //Get data Education berdasarkan Account Id
            //Kemudian ditampilkan dalam bentuk Format CV Berca dengan mengisi text content pada cshtml 
            $.ajax({
                url:
                    "https://localhost:7177/api/Educations/accountId?accountId=" +
                    accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                async: true,

                success: function (educationResult) {
                    //debugger;
                    var educationObj = educationResult.data; 

                    // Mengurutkan data berdasarkan tahun terbaru
                    // a, b merupakan untuk perandingan datanya lalu di sortting
                    educationObj.sort(function (a, b) {
                        return b.years - a.years;
                    });

                    var tableBody = document.getElementById("educationTableBody");
                    for (var i = 0; i < educationObj.length; i++) {
                        var education = educationObj[i];
                        var row = tableBody.insertRow(i);
                        var cityOrRegency = education.location;
                        const cityRemove = cityOrRegency
                            .replace("KOTA", "")
                            .replace("KABUPATEN", "")
                            .trim();
                        const words = cityRemove.split(" ");
                        const formattedCity = words
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            )
                            .join(" ");

                        row.innerHTML =
                            "<td>" +
                            education.years +
                            "</td>" +
                            "<td>" +
                            education.universityName +
                            "</td>" +
                            "<td>" +
                            formattedCity +
                            "</td>" +
                            "<td>" +
                            education.major +
                            "</td>" +
                            "<td>" +
                            education.degree +
                            "</td>";
                    }
                    return accountId;
                },
                error: function (educationError) {
                    alert(educationError.responseText);
                },
            });


            //Get data Non Formal Education berdasarkan Account Id
            //Kemudian ditampilkan dalam bentuk Format CV Berca dengan mengisi text content pada cshtml
            // Pada code berikut terdapat juga memanggil function shuffleArray(item.description, item.organizer)
            // Tujuann function shuffleArray untuk mengacak data Non Formal Edu Bootcamp
            $.ajax({
                url:
                    "https://localhost:7177/api/NonFormalEdu/accountId?accountId=" +
                    accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                async: true,

                success: function (nonFormalEdu) {
                    var nonFormalEduObj = nonFormalEdu.data;
                    nonFormalEduObj.sort(function (a, b) {
                        return b.years - a.years;
                    });
                    const listElement = document.getElementById("listNonEdu");

                    // Bersihkan isi list sebelumnya (jika ada)
                    listElement.innerHTML = "";

                    // Loop melalui data dan tambahkan setiap item ke dalam list
                    nonFormalEduObj.forEach((item) => {
                        const li = document.createElement("li");

                        li.textContent =
                            item.name +
                            ", " +
                            item.organizer +
                            " (" +
                            item.years +
                            ") : " +
                       
                          shuffleArray(item.description, item.organizer);  
                        li.style.color = "black";

             
                        listElement.appendChild(li);
                    });
                },
                error: function (educationError) {
                    alert(educationError.responseText);
                },
            });


            //Get data Qualification berdasarkan Account Id
            //Kemudian ditampilkan dalam bentuk Format CV Berca dengan mengisi text content pada cshtml
            $.ajax({
                url:
                    "https://localhost:7177/api/Qualification/accountId?accountId=" +
                    accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                async: true,
                success: function (data) {
                    //console.log(data);
                    //var qualification = qualificationData.data;
                    var qualification = data.data[0];
          
                    if (qualification == null || qualification.database =="" && qualification.framework==""&& qualification.framework =="" && qualification.programmingLanguage =="" && qualification.others ==""){
                        var qualificationShow = document.getElementById("qualificationView");
                        qualificationShow.style.display = "none";
                    } else {
                        if (qualification.framework == ""){
                            var frameworkShow = document.getElementById("frameworkShow");
                            frameworkShow.style.display = "none";
                        } else {
                            $("#framework").text(qualification.framework);
                        }
    
                        if (qualification.programmingLanguage == ""){
                            var programmingLanguageShow = document.getElementById("programmingLanguageShow");
                            programmingLanguageShow.style.display = "none";
                        } else {
                            $("#programmingLanguage").text(qualification.programmingLanguage);
                        }
    
                        if (qualification.database == ""){
                            var databaseShow = document.getElementById("databaseShow");
                            databaseShow.style.display = "none";
                        } else {
                            $("#database").text(qualification.database);
                        }
    
                        if (qualification.tools == ""){
                            var datatoolsShow = document.getElementById("datatoolsShow");
                            datatoolsShow.style.display = "none";
                        } else {
                            $("#datatools").text(qualification.tools);
                        }
    
                        if (qualification.others == "") {
                            var others = document.getElementById("othersShow_");
                            others.style.display = "none";
                        } else{
                            $("#others").text(qualification.others);
                        }
                    }
                    
                },
                error: function (educationError) {
                    alert(educationError.responseText);
                },
            });


            //Get data Certificate berdasarkan Account Id
            //Kemudian ditampilkan dalam bentuk Format CV Berca dengan mengisi text content pada cshtml
            $.ajax({
                url:
                    "https://localhost:7177/api/Certificate/accountId?accountId=" +
                    accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },

                success: function (certificate) {
                    var certifData = certificate.data;
                    // Mengurutkan data berdasarkan tanggal terbaru
                    certifData.sort(function (a, b) {
                        var dateA = new Date(a.publicationYear);
                        var dateB = new Date(b.publicationYear);
                        return dateB - dateA; // Mengurutkan dari yang terbaru
                    });
                    const listElement = document.getElementById("certificate");
                    const bold = document.createElement("strong");

                    // Bersihkan isi list sebelumnya (jika ada)
                    listElement.innerHTML = "";

                    // Loop melalui data dan tambahkan setiap item ke dalam list
                    certifData.forEach((item) => {
                        const li = document.createElement("li");
                        var validUntil = item.validUntil;
                        if (validUntil != "") {
                            validUntil = `(Valid Until ${item.validUntil})`;
                        }

                        li.innerHTML = `<strong>${item.name}</strong>, <i>${item.publisher}</i>, ${item.publicationYear}  ${validUntil}`;
                        li.style.color = "black";

                        // Jika item adalah objek dan Anda ingin mengambil properti tertentu, contohnya: li.textContent = item.nama;
                        listElement.appendChild(li);
                    });
                },
                error: function (educationError) {
                    alert(educationError.responseText);
                },
            });


            //Get data Employement History berdasarkan Account Id
            //Kemudian ditampilkan dalam bentuk Format CV Berca dengan mengisi text content pada cshtml
            $.ajax({
                url:
                    "https://localhost:7177/api/EmploymentHistory/accountId?accountId=" +
                    accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                async: true,

                success: function (data) {
                    var empHistory = data.data;
                    const listElement = document.getElementById("employeementHistory");

                    // Bersihkan isi list sebelumnya (jika ada)
                    listElement.innerHTML = "";

                    // Loop melalui data dan tambahkan setiap item ke dalam list
                    empHistory.forEach((item) => {
                        const li = document.createElement("li");

                        const parts = item.period.split(" - ");
                        const startDate = parts[0]; // "2023-08"
                        const endDate = parts[1]; // "Now"
                        // Pastikan data tidak null atau undefined sebelum melakukan format tanggal
                        if (startDate) {
                            var startDate_ = new Date(startDate);
                            if (endDate != "Now") {
                                var endDate_ = new Date(endDate);
                                const options = { month: "long", year: "numeric" };
                                endDate_ = endDate_.toLocaleDateString("en-EN", options);
                            } else {
                                endDate_ = "Now";
                            }

                            const options = { month: "long", year: "numeric" };
                            startDate_ = startDate_.toLocaleDateString("en-EN", options);
                            date = startDate_ + " - " + endDate_;
                        } else {
                            return ""; // Jika data null atau undefined, tampilkan string kosong
                        }

                        li.innerHTML = `
                             <li class="text-justify">
                            <div class="row">
                                <div class="col-3" style="color:black">Company Name </div>
                                <div class="col-0" style="color:black">:</div>
                                <div class="col" style="color:black">${item.companyName}</div>
                            </div>
                            <div class="row">
                                <div class="col-3" style="color:black">Job </div>
                                <div class="col-0" style="color:black">:</div>
                                <div class="col" style="color:black">${item.job}</div>
                            </div>
                            <div class="row">
                                <div class="col-3" style="color:black">Period </div>
                                <div class="col-0" style="color:black">:</div>
                                <div class="col" style="color:black">${date}</div>
                            </div>
                            <div class="row">
                                <div class="col-3" style="color:black">Description </div>
                                <div class="col-0" style="color:black">:</div>
                                <div class="col" style="color:black">${item.description}</div>
                            </div>
                        </li>
                        `;
                        li.style.color = "black";

                        // Jika item adalah objek dan Anda ingin mengambil properti tertentu, contohnya: li.textContent = item.nama;
                        listElement.appendChild(li);
                    });
                },
                error: function (educationError) {
                    alert(educationError.responseText);
                },
            });


            //Get data Project History berdasarkan Account Id
            //Kemudian ditampilkan dalam bentuk Format CV Berca dengan mengisi text content pada cshtml
            $.ajax({
                url:
                    "https://localhost:7177/api/ProjectHistory/accountId?accountId=" +
                    accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                async: true,

                success: function (data) {
                    //debugger;
                    var projectHistor = data.data;
                    projectHistor.sort(function (a, b) {
                        return b.year - a.year;
                    });
                    var tableBody = document.getElementById("projectHistoryTableBody");

                    for (var i = 0; i < projectHistor.length; i++) {
                        var project = projectHistor[i];

                        var row = tableBody.insertRow(i);

                        // Menghilangkan bullet dari data jobSpec
                        // var jobSpecWithoutBullet = project.jobSpec.replace(/•/g, "");

                        // Memisahkan data jobSpec dengan baris baru (enter)
                        var jobSpecItems = project.jobSpec.split("\n");


                        // Create ul element to display jobSpec
                        var ul = document.createElement("ul");
                        ul.className = "list-unstyled custom-ul";
                        ul.classList.add("pl-3");

                        if (jobSpecItems != "") {
                            // Populate ul with jobSpec items
                            jobSpecItems.forEach(function (item) {
                                var li = document.createElement("li");
                                if (item.includes("github.com")) {
                                    var url = item.match(/https?:\/\/github\.com\/[^\s]+/g);
                                    if (url) {
                                        var projectLink = `<a href="${url[0]}" target="_blank" style="color: blue;">${project.projectName} (Github)</a>`;
                                        item = item.replace(url[0], projectLink);
                                    }
                                }
                                li.innerHTML = item;
                                ul.appendChild(li);
                            });
                        }

                
                        row.innerHTML =
                            "<td>" +
                            project.projectName +
                            "</td>" +
                            "<td></td>" + 
                            "<td>" +
                            project.year +
                            "</td>" +
                            "<td>" +
                            project.companyName +
                            "</td>";

                        // Tambahkan elemen ul ke sel kedua (indeks 1)
                        row.cells[1].appendChild(ul);
                    }
                },
                error: function (educationError) {
                    alert(educationError.responseText);
                },
            });
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
    $("#loader").hide();
}


function getAccountIdFromToken() {
    var token = sessionStorage.getItem("Token");
    if (token) {
        var base64Url = token.split(".")[1];
        var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        var payload = JSON.parse(atob(base64));

        return payload.AccountId;
    }

    return null;
}
function getUserRole() {
    var token = sessionStorage.getItem("Token");
    if (token) {
        var base64Url = token.split(".")[1];
        var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        var payload = JSON.parse(atob(base64));

        return parseInt(payload.RoleId, 10);
    }

    return null;
}

// Function ini bertujuan untuk mengacak data Non Formal education employee dengan kondisi organizer = PT. Berca Hardayaperkasa
// Function ini menerima 2 parameter yaitu parameter array dari data Non Formal Edu dan organizer
function shuffleArray(array, organizer) {
    
    if (organizer != "PT. Berca Hardayaperkasa") {
     
        return array;
    } else {

        // Memisahkan data "Web Template (CSS, Bootstrap)"" sebelum displit berdasarkan ","
        // Bertujuan agar satu kesatuan kalimat tersebut tidak ikut terpisah
        const regexWebTemplate = /, Web Template \(CSS, Bootstrap\)/;
        const match = regexWebTemplate.exec(array);
        let webTemp = match[0].replace(',', ''); 

         // Memisahkan data "Pattern (MVC, MVVM, N-Layered Architecture) sebelum displit berdasarkan ","
        // Bertujuan agar satu kesatuan kalimat tersebut tidak ikut terpisah kareba terdapat ","
        const regexPattern = /, Pattern \(MVC, MVVM, N-Layered Architecture\)/;
        const matchPattern = regexPattern.exec(array);
        let pattern = matchPattern[0].replace(',', ''); 

        //Mengahpus data Regex web temp dan pattern
        const updatedData = array.replace(regexWebTemplate, "").replace(regexPattern, "");
    
      

        const text = updatedData.split(',');
        // Pengacakan data
        for (let i = text.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [text[i], text[j]] = [text[j], text[i]];
        }

        //Menggabungkan kembali data yang dipisah tadi dengan data acak, lalu di acaj lagi
        const additionalItems = [webTemp, pattern];
        additionalItems.forEach(item => {
            const randomIndex = Math.floor(Math.random() * (text.length + 1));
            text.splice(randomIndex, 0, item);
        });
       
        return text;
    }
    

}