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
        success: function (result) {
            //debugger;
           
            var obj = result.data.result; //data yg didapat dari api
            var birthDate = obj.birthdate;
            const date = new Date(birthDate);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const date_ = date.toLocaleDateString('id-ID', options);
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
                async: true,

                success: function (nonFormalEdu) {
                    var nonFormalEduObj = nonFormalEdu.data;
                    const listElement = document.getElementById("listNonEdu");

                    // Bersihkan isi list sebelumnya (jika ada)
                    listElement.innerHTML = '';
                
                    
                    // Loop melalui data dan tambahkan setiap item ke dalam list
                    nonFormalEduObj.forEach(item => {
                        const li = document.createElement("li");
                      
                        li.textContent = item.name+", "+item.organizer+" ("+item.years+") : "+item.description; // Jika item adalah teks biasa
                        li.style.color = "black";
                        
                        // Jika item adalah objek dan Anda ingin mengambil properti tertentu, contohnya: li.textContent = item.nama;
                        listElement.appendChild(li);
                    });
                },
                error: function (educationError) {
                    alert(educationError.responseText);
                }
            });



        },
        error: function (errormessage) { alert(errormessage.responseText); }
    });

   
}


