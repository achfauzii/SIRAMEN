$(document).ready(function () {
    //debugger;
    // Mendapatkan nilai parameter accountId dari URL
    loadData();

});

function loadData() {
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

            var obj = result.data.result; //data yg didapat dari api
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

                    var tableBody = document.getElementById('educationTableBody');
                    for (var i = 0; i < educationObj.length; i++) {
                        var education = educationObj[i];
                        var row = tableBody.insertRow(i);

                        row.innerHTML =
                            "<td>" + education.years + "</td>" +
                            "<td>" + education.universityName + "</td>" +
                            "<td>" + education.location + "</td>" +
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
                                <div class="col" style="color:black">${item.period}</div>
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

                    var tableBody = document.getElementById('projectHistoryTableBody');

                    for (var i = 0; i < projectHistor.length; i++) {
                        var project = projectHistor[i];

                        var row = tableBody.insertRow(i);

                        row.innerHTML =
                            "<td>" + project.projectName + "</td>" +
                            "<td>" + project.jobSpec + "</td>" +
                        
                            "<td>" + project.year + "</td>" +
                            "<td>" + project.companyName + "</td>";
                    }

                },
                error: function (educationError) {
                    alert(educationError.responseText);
                }
            });
        },
        error: function (errormessage) { alert(errormessage.responseText); }
    });


}


