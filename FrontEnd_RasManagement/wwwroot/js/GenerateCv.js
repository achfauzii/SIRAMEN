$(document).ready(function () {
    //debugger;
    // Mendapatkan nilai parameter accountId dari URL
    $("#backButton").on("click", function () {
        history.back(); // Go back to the previous page
    });
    loadData();

});

function loadData() {
    $('#loader').show();
    var urlParams = new URLSearchParams(window.location.search);
    var accountId = urlParams.get('accountId');
    $.ajax({
        url: "https://localhost:7177/api/Employees/accountId?accountId=" + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            //debugger;

            var obj = result.data.result; // Data yang diterima dari API
            var birthDate = obj.birthdate;

            var date_ = "";
            if (birthDate != null) {
                const date = new Date(birthDate);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                date_ = date.toLocaleDateString('id-ID', options);
            } else {
                date_ = "";
            }
           

            document.getElementById('fullName').textContent = obj.fullname;
            document.getElementById('nickName').textContent = obj.nickname;
            document.getElementById('birthPlace').textContent = obj.birthplace;
            document.getElementById('birthDate').textContent = date_;
            document.getElementById('gender').textContent = obj.gender;
            document.getElementById('religion').textContent = obj.religion;
            document.getElementById('martialStatus').textContent = obj.maritalstatus;
            document.getElementById('nationality').textContent = obj.nationality;

            //debugger;
            // API GET (Education By AccountId)
            $.ajax({
                url: "https://localhost:7177/api/Educations/accountId?accountId=" + accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("Token")
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

                    var tableBody = document.getElementById('educationTableBody');
                    for (var i = 0; i < educationObj.length; i++) {
                        var education = educationObj[i];
                        var row = tableBody.insertRow(i);
                        var cityOrRegency = education.location;
                        const cityRemove = cityOrRegency.replace('KOTA', '').replace('KABUPATEN', '').trim();
                        const words = cityRemove.split(' ');
                        const formattedCity = words
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(' ');
                 
                        row.innerHTML =
                            "<td>" + education.years + "</td>" +
                            "<td>" + education.universityName + "</td>" +
                            "<td>" + formattedCity + "</td>" +
                            "<td>" + education.major + "</td>" +
                            "<td>" + education.degree + "</td>";
                    }
                    return accountId;
                },
                error: function (educationError) {
                    alert(educationError.responseText);
                }
            });

            // API GET (NonFromalEdu By AccountId)
            $.ajax({
                url: "https://localhost:7177/api/NonFormalEdu/accountId?accountId=" + accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("Token")
                },
                async: true,

                success: function (nonFormalEdu) {
                    var nonFormalEduObj = nonFormalEdu.data;
                    nonFormalEduObj.sort(function (a, b) {
                        return b.years - a.years;
                    });
                    const listElement = document.getElementById("listNonEdu");

                    // Bersihkan isi list sebelumnya (jika ada)
                    listElement.innerHTML = '';


                    // Loop melalui data dan tambahkan setiap item ke dalam list
                    nonFormalEduObj.forEach(item => {
                        const li = document.createElement("li");

                        li.textContent = item.name + ", " + item.organizer + " (" + item.years + ") : " + item.description; // Jika item adalah teks biasa
                        li.style.color = "black";

                        // Jika item adalah objek dan Anda ingin mengambil properti tertentu, contohnya: li.textContent = item.nama;
                        listElement.appendChild(li);
                    });
                },
                error: function (educationError) {
                    alert(educationError.responseText);
                }
            });

            // API GET (Qualification By AccountId)
            $.ajax({
                url: "https://localhost:7177/api/Qualification/accountId?accountId=" + accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("Token")
                },
                async: true,

                success: function (data) {
                    //var qualification = qualificationData.data;
                    var qualification = data.data[0];
                    $("#framework").text(qualification.framework);
                    $("#programmingLanguage").text(qualification.programmingLanguage);
                    $("#database").text(qualification.database);
                   
                    
                    if (qualification.others == "") {
                        var others = document.getElementById("othersShow_");
              
                        others.style.display = "none";
                    }
                    $("#others").text(qualification.others);



                },
                error: function (educationError) {
                    alert(educationError.responseText);
                }
            });


            // API GET (Certificate By AccountId)
            $.ajax({
                url: "https://localhost:7177/api/Certificate/accountId?accountId=" + accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("Token")
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
                    listElement.innerHTML = '';


                    // Loop melalui data dan tambahkan setiap item ke dalam list
                    certifData.forEach(item => {
                        const li = document.createElement("li");
                        var validUntil = item.validUntil;
                        if (validUntil != "") {
                            validUntil = `(Valid Until ${item.validUntil})`
                        }

                        li.innerHTML = `<strong>${item.name}</strong>, <i>${item.publisher}</i>, ${item.publicationYear}  ${validUntil}`;
                        li.style.color = "black";

                        // Jika item adalah objek dan Anda ingin mengambil properti tertentu, contohnya: li.textContent = item.nama;
                        listElement.appendChild(li);
                    });
                },
                error: function (educationError) {
                    alert(educationError.responseText);
                }
            });

            // API GET (Employeement History By AccountId)
            $.ajax({
                url: "https://localhost:7177/api/EmploymentHistory/accountId?accountId=" + accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("Token")
                },
                async: true,

                success: function (data) {
                    var empHistory = data.data;
                    const listElement = document.getElementById("employeementHistory");


                    // Bersihkan isi list sebelumnya (jika ada)
                    listElement.innerHTML = '';


                    // Loop melalui data dan tambahkan setiap item ke dalam list
                    empHistory.forEach(item => {
                        const li = document.createElement("li");

                        const parts = item.period.split(" - ");
                        const startDate = parts[0]; // "2023-08"
                        const endDate = parts[1];  // "Now"
                        // Pastikan data tidak null atau undefined sebelum melakukan format tanggal
                        if (startDate) {

                            var startDate_ = new Date(startDate);
                            if (endDate != "Now") {
                                var endDate_ = new Date(endDate);
                                const options = { month: 'long', year: 'numeric' };
                                endDate_ = endDate_.toLocaleDateString('en-EN', options);
                            }
                            else {
                                endDate_ = "Now";
                            }

                            const options = { month: 'long', year: 'numeric' };
                            startDate_ = startDate_.toLocaleDateString('en-EN', options);
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
                }
            });


            // API GET (ProjectHistory By AccountId)
            $.ajax({
                url: "https://localhost:7177/api/ProjectHistory/accountId?accountId=" + accountId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("Token")
                },
                async: true,

                success: function (data) {
                    //debugger;
                    var projectHistor = data.data;
                    projectHistor.sort(function (a, b) {
                        return b.year - a.year;
                    });
                    var tableBody = document.getElementById('projectHistoryTableBody');

                    for (var i = 0; i < projectHistor.length; i++) {
                        var project = projectHistor[i];

                        var row = tableBody.insertRow(i);

                        // Menghilangkan bullet dari data jobSpec
                        var jobSpecWithoutBullet = project.jobSpec.replace(/•/g, '');

                        // Memisahkan data jobSpec dengan baris baru (enter)
                        var jobSpecItems = jobSpecWithoutBullet.split('\n');

                        // Membuat elemen ul untuk menampilkan jobSpec
                        var ul = document.createElement('ul');

                        ul.classList.add('pl-3'); 
                        // Mengisi elemen ul dengan item-item jobSpec
                        jobSpecItems.forEach(function (item) {
                            var li = document.createElement('li');
                            li.innerHTML = item;
                            ul.appendChild(li);
                        });

                        row.innerHTML =
                            "<td>" + project.projectName + "</td>" +
                            "<td></td>" + // Kosongkan sel ini, kami akan menambahkan ul di bawah
                            "<td>" + project.year + "</td>" +
                            "<td>" + project.companyName + "</td>";

                        // Tambahkan elemen ul ke sel kedua (indeks 1)
                        row.cells[1].appendChild(ul);
                    }

                },
                error: function (educationError) {
                    alert(educationError.responseText);
                }
            });
        },
        error: function (errormessage) { alert(errormessage.responseText); }
    });
    $('#loader').hide();


}


